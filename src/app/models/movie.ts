// models/Movie.ts
import { Schema, model, models } from "mongoose";

const MovieSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        publishingYear: { type: Number, required: true },
        poster: { type: String, required: true }, // store image URL or path
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Movie = models.Movie || model("Movie", MovieSchema);
