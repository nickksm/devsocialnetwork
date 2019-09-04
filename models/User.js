const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

/* userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
  
    delete userObject.password;
    return userObject;
  }; */

module.exports = User = mongoose.model("user", UserSchema);
