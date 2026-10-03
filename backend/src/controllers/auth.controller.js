const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { sendEmail, emailTemplates } = require('../lib/email');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/auth.validators');

// Cookie options
const getCookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: maxAgeMs,
});

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 mins
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate Access and Refresh JWTs
 */
const generateTokens = (userId, role) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

  const accessToken = jwt.sign(
    { userId, role },
    accessSecret,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    refreshSecret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Role check: default USER, allow ORGANIZER. Never allow ADMIN via registration
    const targetRole = validatedData.role === 'ORGANIZER' ? 'ORGANIZER' : 'USER';
    let roleRecord = await prisma.role.findUnique({
      where: { name: targetRole },
    });

    if (!roleRecord) {
      // Auto-create role if seed hasn't run yet
      roleRecord = await prisma.role.create({
        data: { name: targetRole },
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        roleId: roleRecord.id,
      },
      include: { role: true },
    });

    // Create tokens & DB refresh record
    const { accessToken, refreshToken } = generateTokens(newUser.id, newUser.role.name);
    const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: refreshExpiresAt,
      },
    });

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
    res.cookie('refreshToken', refreshToken, getCookieOptions(REFRESH_TOKEN_MAX_AGE));

    // Send verification email asynchronously without blocking registration
    try {
      const verifyToken = crypto.randomBytes(32).toString('hex');
      await prisma.emailVerification.create({
        data: {
          token: verifyToken,
          userId: newUser.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      const template = emailTemplates.emailVerification(newUser.name, verifyToken);
      sendEmail({ to: newUser.email, ...template }).catch((err) => {
        console.warn('[EMAIL WARNING] Could not send verification email (SMTP check):', err.message);
      });
    } catch (e) {
      console.warn('[EMAIL SETUP] Verification email setup skipped:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.name,
        avatar: newUser.avatar,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role.name);
    const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiresAt,
      },
    });

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
    res.cookie('refreshToken', refreshToken, getCookieOptions(REFRESH_TOKEN_MAX_AGE));

    // Log login activity
    try {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          details: { ip: req.ip, userAgent: req.get('user-agent') },
        },
      });
    } catch (_) {}

    res.json({
      success: true,
      message: 'Logged in successfully.',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 */
const refresh = async (req, res, next) => {
  try {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required.',
      });
    }

    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { token: incomingToken },
      include: { user: { include: { role: true } } },
    });

    if (!tokenDoc || tokenDoc.isRevoked || tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        code: 'REFRESH_TOKEN_EXPIRED',
        message: 'Invalid or expired session. Please log in again.',
      });
    }

    // Verify JWT integrity
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
    try {
      jwt.verify(incomingToken, refreshSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.',
      });
    }

    // Revoke old refresh token (token rotation)
    await prisma.refreshToken.update({
      where: { id: tokenDoc.id },
      data: { isRevoked: true },
    });

    // Generate new pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      tokenDoc.user.id,
      tokenDoc.user.role.name
    );

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: tokenDoc.user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
      },
    });

    res.cookie('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
    res.cookie('refreshToken', newRefreshToken, getCookieOptions(REFRESH_TOKEN_MAX_AGE));

    res.json({
      success: true,
      message: 'Session refreshed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { isRevoked: true },
      });
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        isEmailVerified: true,
        createdAt: true,
        role: { select: { name: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        ...user,
        role: user.role.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordReset.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt,
        },
      });

      const template = emailTemplates.passwordReset(user.name, resetToken);
      sendEmail({ to: user.email, ...template }).catch((err) => {
        console.warn('[EMAIL WARNING] Failed to send password reset email:', err.message);
      });
    }

    // Always respond with success to prevent user email enumeration
    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been dispatched.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password & mark token used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { isUsed: true },
      }),
      // Revoke all existing sessions for security
      prisma.refreshToken.updateMany({
        where: { userId: resetRecord.userId },
        data: { isRevoked: true },
      }),
    ]);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new credentials.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/verify-email
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token required.' });
    }

    const verifyRecord = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verifyRecord || verifyRecord.isUsed || verifyRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Email verification token is invalid or has expired.',
      });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verifyRecord.userId },
        data: { isEmailVerified: true },
      }),
      prisma.emailVerification.update({
        where: { id: verifyRecord.id },
        data: { isUsed: true },
      }),
    ]);

    res.json({
      success: true,
      message: 'Email verified successfully. Welcome to EventHub!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
