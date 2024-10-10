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
    password: {
      type: String,
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
    avatar: {
      type: String,
    },
    devicesToken: [{ type: String }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User
