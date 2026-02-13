import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
isVerified: {
  type: Boolean,
  default: false,
},

status: {
  type: String,
  enum: ["active", "banned"],
  default: "active",
},


    role: {
      type: String,
      enum: ["customer", "vendor"],
      default: "customer",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model("Account", accountSchema);
