const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const usersShema = new mongoose.Schema({
    name:{
        type: String,
        required : true,
        trim:true
    },
    email:{
        type: String,
        required : true,
        unique:true,
        trim:true,
        match:[/.+\@.+|..+/,"Please enter valid email address"],

    },
    password:{
        type:String,
        required:true,
        minlength:24

    },
    photo:{
       type:String,
       default:""
    },
    role :{
        type:String ,
        enum:["user","admin"],
        default:"user",

    },
    location:{
        type:String ,
        
    },
    profileVisibility:{
         type:String ,
        enum:["public","private"],
        default:"public",
    },
    skillsOffered: { 
        type: [String], 
        default: [], 
    }, 
    skillsWanted: { 
        type: [String], 
        default: [], 
    },     
   },
   { timestamps:true}
);

module.exports = mongoose.model("User", usersShema);