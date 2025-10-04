import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL("/log-in", req.url);
    const response = NextResponse.redirect(url);
    response.cookies.set("session", "", {
        path: "/",
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: false,
        maxAge: 0,
    });
    return response;
}
