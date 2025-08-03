import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Handle seller routes
    if (pathname.startsWith("/seller")) {
        if (!token) {
            return NextResponse.redirect(new URL("/signin", request.url));
        }

        try {
            const base64Payload = token.split(".")[1];
            const jsonPayload = Buffer.from(base64Payload, "base64").toString();
            const decoded = JSON.parse(jsonPayload);

            // Check if user is a seller
            if (!decoded?.isSeller) {
                return NextResponse.redirect(new URL("/become-seller", request.url));
            }

            // Redirect seller root paths to dashboard
            const sellerRedirectPaths = ["/seller/products", "/seller/orders", "/seller/profile"];
            if (sellerRedirectPaths.includes(pathname)) {
                return NextResponse.redirect(new URL("/seller/dashboard", request.url));
            }

            return NextResponse.next();
        } catch (err) {
            console.error("JWT decode failed:", err);
            return NextResponse.redirect(new URL("/signin", request.url));
        }
    }

    // Handle admin routes
    if (pathname.startsWith("/admin")) {
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

            const redirectPaths = ["/admin/products", "/admin/users", "/admin/orders", "/admin/support"];
            if (redirectPaths.includes(pathname)) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }

            return NextResponse.next();
        } catch (err) {
            console.error("JWT decode failed:", err);
            return NextResponse.redirect(new URL("/signin", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/seller/:path*"]
};
