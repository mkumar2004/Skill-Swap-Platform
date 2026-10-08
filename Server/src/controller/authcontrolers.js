const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {cloudinary} = require("../Config/cloudinary");
const User = require("../model/User.model");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // 1. Validate required fields
    // if (!name || !email || !password || !location) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please provide all required fields",
    //   });
    // }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 3. Upload photo to Cloudinary
    let photoUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "skill-swap/users",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      photoUrl = result.secure_url;
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      photo: photoUrl,
    });

    // 6. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 7. Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 8. Send response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

const login = async(req,res)=>{
  try {
    const {email,password} = req.body
     
    const user = await User.findOne({
  email: email.toLowerCase().trim(),
});

    if(!user){
        return res.status(404).json({
        success: false,
        message: "User Not found",
      });
    }
    
    const ispassCrt = await bcrypt.compare(password,user.password)

    if(!ispassCrt){
       return res.status(401).json({
        message:"Invalid Password"
       })
    }

    const token = jwt.sign({
      userId:user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"7d",
    }
  )
   

   res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
   
     return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      
      },
    });
    
  } catch (error) {
     console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

module.exports = {
  register,
  login
};