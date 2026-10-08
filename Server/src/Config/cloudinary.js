const cloudinary = require("cloudinary").v2;

const ConnectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API,
      api_secret: process.env.CLOUDINARY_SCREAT_KEY,
    });

    console.log("Cloudinary is connected");
  } catch (error) {
    console.log("Cloudinary is not connected", error);
  }
};

module.exports = {
  cloudinary,
  ConnectCloudinary,
};