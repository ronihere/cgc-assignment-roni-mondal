// models/User.ts
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// Avoid recompiling model on hot reload
export const User = models.User || model("User", UserSchema);
