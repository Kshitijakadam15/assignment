const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
 
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      minLength: [10, "Mobile number can't be less than 10 digits"],
      maxLength: [10, "Mobile number can't be greater than 10 digits"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    password: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
