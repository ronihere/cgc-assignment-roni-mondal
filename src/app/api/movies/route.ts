import { Movie } from "@/app/models/movie";
import { verify } from "@/lib/auth";
import { CloudinaryService } from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongo";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";
// import { getDb } from "@/lib/mongo";
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        await connectDB();

        const movies = await Movie.find({})
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            ;

        const total = await Movie.countDocuments();
        // const total = movies.length;
        const totalPages = Math.ceil(total / limit);

        return new Response(JSON.stringify({ movies, totalPages }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}



// POST handler (for uploading image)
export async function POST(req: Request) {
    try {
        let token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            const reqCookies = await cookies();
            token = reqCookies.get("session")?.value;
        }

        const payload = token ? await verify(token, process.env.JWT_SECRET || '') : null;
        const userId = payload?.userId;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData();
        const file = formData.get("file") as Blob | null;
        const title = formData.get("title") as string | null;
        const publishingYear = formData.get("publishingYear") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate MIME type
        const mimeType = file.type; // e.g., "image/png", "image/jpeg"
        if (!mimeType.startsWith("image/")) {
            return NextResponse.json({ error: "Uploaded file is not an image" }, { status: 400 });
        }

        // Convert Blob to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to Cloudinary
        const imageUrl = await CloudinaryService.uploadImage(buffer, "uploads");

        // Save imageUrl to DB if needed
        await connectDB();
        const newMovie = new Movie({
            title,
            publishingYear: publishingYear ? parseInt(publishingYear, 10) : undefined,
            poster: imageUrl,
            createdBy: userId // Replace with actual user ID from session
        });

        await newMovie.save();
        return NextResponse.json(newMovie, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}




export async function PATCH(req: Request) {
    try {
        let token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            const reqCookies = await cookies();
            token = reqCookies.get("session")?.value;
        }

        const payload = token ? await verify(token, process.env.JWT_SECRET || "") : null;
        const userId = payload?.userId;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as Blob | null;
        const title = formData.get("title") as string | null;
        const publishingYear = formData.get("publishingYear") as string | null;
        const movieId = formData.get("movieId") as string | null; // need ID to update

        if (!movieId) {
            return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
        }

        await connectDB();

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 });
        }

        // Check ownership (optional, but recommended)
        if (movie.createdBy.toString() !== userId.toString()) {
            return NextResponse.json({ error: "Forbidden! you can only edit the movies created by you." }, { status: 403 });
        }

        // Update fields
        if (title) movie.title = title;
        if (publishingYear) movie.publishingYear = parseInt(publishingYear, 10);

        if (file) {
            // Validate image
            const mimeType = file.type;
            if (!mimeType.startsWith("image/")) {
                return NextResponse.json({ error: "Uploaded file is not an image" }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const imageUrl = await CloudinaryService.uploadImage(buffer, "uploads");
            movie.poster = imageUrl;
        }

        await movie.save();

        return NextResponse.json(movie, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
