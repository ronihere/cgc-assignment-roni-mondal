// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "./lib/auth";

export async function middleware(req: NextRequest) {
    console.log("Middleware running for:", req.nextUrl.pathname);
    const token = req.cookies.get("session")?.value;
    const notProtectedPaths = ["/api/auth/sign-up"];
    if (notProtectedPaths.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const bearerToken = authHeader.split(" ")[1];
            try {
                const payload: any = await verify(bearerToken, process.env.JWT_SECRET!);
                const res = NextResponse.next();
                res.cookies.set("userId", payload.userId.toString(), { httpOnly: true });
                return res;
            } catch (err) {
            }
        }
        return NextResponse.redirect(new URL("/log-in", req.url));
    }

    try {
        const payload: any = await verify(token, process.env.JWT_SECRET!);
        const res = NextResponse.next();
        res.cookies.set("userId", payload.userId.toString(), { httpOnly: true });
        return res;
    } catch (err) {
        return NextResponse.redirect(new URL("/log-in", req.url));
    }
}

// Run middleware only on protected routes
export const config = {
    matcher: ["/api/movies/:path*"],
};
