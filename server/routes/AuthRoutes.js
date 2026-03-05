import { Router } from "express";
import { removeProfileImage, addProfileImage, getUserInfo, login, signUp, updateProfile, logOut } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from 'multer'
import os from 'os';

const authRoutes = Router();

const upload = multer({ dest: os.tmpdir() });

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get('/user-info', verifyToken, getUserInfo)
authRoutes.post('/update-profile', verifyToken, updateProfile)
authRoutes.post('/add-profile-image', verifyToken,upload.single("profile-image"), addProfileImage)
authRoutes.delete('/remove-profile-image', verifyToken, removeProfileImage)
authRoutes.post('/logout', logOut)

export default authRoutes;
