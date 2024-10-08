const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      minLength: 1,
      maxLength: 20,
      trim: true,
    },
    refreshToken: {
      type: String,
      allowNull: true,
    },
    passWord: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
      minLength: 6,
      maxLength: 20,
      trim: true,
      allowNull: true,
      index: true,
      sparse: true,
      unique: true,
      require: false,
      partialFilterExpression: true,
    },
    userName: {
      type: String,
      minLength: 5,
      maxLength: 30,
      trim: true,
      require: true,
    },
    avatar: {
      type: String,
    },
    devicesToken: [{ type: String }],
    follows: [{ type: Schema.Types.ObjectId, ref: "Follow" }],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User
