const { uploadToCloudinary, deleteFromCloudinary } = require('../lib/cloudinary');

/**
 * POST /api/upload/image
 * Protected: Authenticated users
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.',
      });
    }

    const folder = req.body.folder || 'events';

    // If Cloudinary credentials are set up, upload directly to Cloudinary
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key'
    ) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: `eventhub/${folder}`,
      });

      return res.json({
        success: true,
        message: 'Image uploaded successfully.',
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    }

    // Graceful fallback when Cloudinary keys haven't been pasted yet:
    // Convert to base64 data URI so user can see their uploaded image immediately!
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const mockPublicId = `local_${Date.now()}`;

    res.json({
      success: true,
      message: 'Image received (fallback preview mode: configure Cloudinary for cloud hosting).',
      url: base64Data,
      publicId: mockPublicId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/upload/image
 * Protected: Authenticated users
 */
const removeImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'publicId is required to delete image.',
      });
    }

    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
    ) {
      await deleteFromCloudinary(publicId);
    }

    res.json({
      success: true,
      message: 'Image removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  removeImage,
};
