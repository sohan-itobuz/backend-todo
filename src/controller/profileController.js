import user from "../models/user.js";

export default class ProfileController {
  profile = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const userInfo = await user.findOne({ _id: userId });

      res.status(200).json({
        success: true,
        message: 'User details fetched successfully',
        userDetails: userInfo,
      });
    } catch (err) {
      if (err.message == 'jwt expired') {
        res.status(401);
      }
      next(err);
    }
  };

  uploadPhoto = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      if (!req.file) {
        res.status(400);

        throw new Error('No Image Uploaded');
      }

      const updatedUser = await user.findByIdAndUpdate(userId, {
        imagePath: `${req.protocol}://${req.get('host')}/${req.file.path}`,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        userDetails: updatedUser,
      });
    } catch (err) {
      if (err.message == 'jwt expired') {
        res.status(401);
      }
      next(err);
    }
  };
}