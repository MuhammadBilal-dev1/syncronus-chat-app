import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ye line lazmi add karein taake keys foran load hon
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Testing ke liye ye line add karein (Sirf ek baar terminal check karne ke liye)
console.log("Cloudinary Configured with Key:", process.env.CLOUDINARY_API_KEY ? "YES" : "NO");

export default cloudinary;