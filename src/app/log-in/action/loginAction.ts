"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongo";
import { User } from "@/app/models/user";
import { redirect } from "next/navigation";
import { sign } from "@/lib/auth";
import { success } from "zod";

export async function loginAction(formData: FormData) {
    try {
    await connectDB();
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    const user = await User.findOne({ email });
    if (!user) {
        return { error: "User not found", success: false };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { error: "Invalid credentials", success: false };
    }

    const token = await sign(
        { userId: user._id.toString(), email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        60 * 60 * 24 * 7
    );

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

        return { success: true }
    } catch (err: any) {
        return { error: "Something went wrong", success: false };
    }
}
