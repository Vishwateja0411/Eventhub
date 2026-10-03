/**
 * Role-based authorization middleware
 * @param  {...string} allowedRoles - E.g. 'ADMIN', 'ORGANIZER', 'USER'
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization check.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] role. Your role is '${req.user.role}'.`,
      });
    }

    next();
  };
};

module.exports = authorize;
