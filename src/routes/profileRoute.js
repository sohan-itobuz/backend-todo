import express from 'express';
import multer from 'multer';
import ProfileController from '../controller/profileController.js';

const profileRouter = express.Router();
const userProfile = new ProfileController();

const storage = multer.diskStorage({
  destination: 'imageDatabase/userUploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

profileRouter.post('/', userProfile.profile);

profileRouter.post('/upload', upload.single('DP'), userProfile.uploadPhoto);

export default profileRouter;