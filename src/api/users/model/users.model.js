const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var uniqueValidator = require("mongoose-unique-validator");
const SALT_WORK_FACTOR = 8;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name in name field!"],
      trim: true,
      validate(str) {
        if (!validator.isByteLength(str, { min: 3, max: 30 })) {
          throw new Error("Name must be between 3 to 30 characters long!");
        }
      },
    },
    email: {
      type: String,
      required: [true, "Please enter email!"],
      trim: true,
      unique: [true, "User already registered with this Email !"],
      uniqueCaseInsensitive: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter valid email!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error('Password cannot be "password"!');
      },
    },
    role:{
        type: String,
        default:"Manager",
        required: true,
        enum:["Admin", "Manager"]
    },
    profilePic: {
      type: String,
    },
    // we use tokens array bcz we can login from different devices so we need different token for each device
    // so if we logout from one we can from from the other session
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    //to create track of when user was created or updated
    timestamps: true,
  }
);

//crating ondex on email
userSchema.index({ email: 1 }, { unique: true, name: "IDX_EMAIL" });

//finding user from email and pass
userSchema.statics.findByCredientials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user && !password && !email) {
    throw new Error("Unable to login! Please enter valid email and password! ");
  }
  if (!user) {
    throw new Error("Unable to login! Invalid credentials.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error(" Invalid password Entered!");
  }
  return user;
};

//get Size of collection
userSchema.statics.getStorageDetails = async function () {
  const Size = await User.collection.stats({ scale: 1024 });
  return Size.totalSize;
};

//when we call res.send() its calling json.stringify() behind the scenes
//whenever the object gets stringify toJSON() is called so we use it here to hide data
userSchema.methods.toJSON = function () {
  const user = this;
  //get our raw object with user data attached
  //it will remove all the stuff mongoose has on it to perform operations
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  //we delete img to display to user bcz it takes much time to fetch binary data of img
  //delete userObject.profilePic
  return userObject;
};

//for methods on the instance and individual user
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_USER_CODE,
    {
      expiresIn: process.env.JWT_USER_EXPIRES_IN,
    }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.generateRandomPassword = function () {
  const randomPass = crypto.randomBytes(8).toString("hex").slice(0,8);
  return randomPass;
};

//we are using middleware property of mongoose to check the data before saving
// we have to use simple function bcz arrow functions dont do binding
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR);
  }
  //next makes the pre to go on next stage i.e save the model else it will stop here
  next();
});

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

userSchema.plugin(uniqueValidator, { message: "{PATH} already exists!" });
//creating model of moongoose and then creating an instance of model and then saving it
const User = mongoose.model("User", userSchema);
module.exports = User;
