import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { unlinkSync } from "fs";
import cloudinary from "../lib/cloudinary.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Email and Password is required.");
      return;
    }

    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Email and Password is required.");
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("Invalid Email and Password.");
      return;
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      res.status(404).send("Invalid Email and Password.");
      return;
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstname,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User not Found.");
    }

    res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      res.status(400).send("Details are Required!");
      return;
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is Required!");
    }

    // 1. Cloudinary par upload
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "syncronus-chat-app",
    });

    // 2. Local temp file ko foran delete karein
    unlinkSync(req.file.path);

    // 3. Database mein URL save karein
    const updateUser = await User.findByIdAndUpdate(
      req.userId,
      { image: result.secure_url }, // Ye full URL hai: https://res.cloudinary.com/...
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updateUser.image,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user || !user.image) {
      return res.status(404).send("User or image not found.");
    }

    // Cloudinary se delete karne ke liye Public ID nikalna
    // URL: https://res.cloudinary.com/demo/image/upload/v1234/folder/img.jpg
    const publicId = user.image.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    user.image = null;
    await user.save();

    return res.status(200).send("Profile image removed successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 1, secure: true, sameSite: 'None'})
    res.status(200).send("Logout Successfully.");
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};
