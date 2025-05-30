import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
        const base64Payload = token.split(".")[1];
        const jsonPayload = Buffer.from(base64Payload, "base64").toString();
        const decoded = JSON.parse(jsonPayload);

        if (!decoded?.isAdmin) {
            return NextResponse.redirect(new URL("/store", request.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error("JWT decode failed:", err);
        return NextResponse.redirect(new URL("/signin", request.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/admin"],
};
