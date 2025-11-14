import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./app/authhandlers/auth";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register", "/"];
const allowedOrigins = [
  'http://localhost:3000',
  'https://sms-two-sepia.vercel.app/',
];

export default async function proxy(request: NextRequest) {
  try {
    // Get session with error handling
    const session = await auth().catch((error) => {
      console.error("Auth error in middleware:", error);
      return null;
    });

    const origin = request.headers.get('origin');
    const { pathname, searchParams } = request.nextUrl;
    const callbackUrl = searchParams.get("callbackUrl");

    // Only check origin for non-GET requests to avoid blocking navigation
    if (origin && request.method !== 'GET' && !allowedOrigins.includes(origin)) {
      // Add environment URL if it exists
      const envUrl = process.env.NEXT_PUBLIC_AUTH_URL;
      if (envUrl && !allowedOrigins.includes(envUrl)) {
        allowedOrigins.push(envUrl);
      }
      
      if (!allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
          status: 400,
          statusText: 'Bad Request',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }

    // Handle callback URL redirect for authenticated users
    if (session?.user && callbackUrl) {
      if (isValidCallbackUrl(callbackUrl, request.url)) {
        if (pathname === "/login") {
          return NextResponse.redirect(new URL(callbackUrl, request.url));
        }
      } else {
        console.warn("Invalid callback URL detected:", callbackUrl);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isPublic = publicRoutes.includes(pathname);

    // Redirect to login for unauthenticated users accessing protected routes
    if (isProtected && !session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from public routes (except with callback)
    if (isPublic && session?.user && !callbackUrl && pathname !== "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const url = request.nextUrl;
    let q = url.searchParams.get("q");

    if (pathname.includes("dashboard")) {
      let q = url.searchParams.get("q");

      // ✅ If q is missing or null, set default
      if (!q || q === "null") {
        url.searchParams.set("q", "6915fd51e1018ed4bac50d28");
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Middleware error:", error);
    // In case of any error, allow the request to continue
    return NextResponse.next();
  }
}

function isValidCallbackUrl(url: string, baseUrl: string): boolean {
  try {
    // Allow relative URLs starting with /
    if (url.startsWith("/")) {
      // Ensure it's not redirecting to public auth routes
      const publicAuthRoutes = ["/login", "/register"];
      return !publicAuthRoutes.includes(url);
    }

    // For absolute URLs, validate against the current domain
    const parsedUrl = new URL(url);
    const baseUrlParsed = new URL(baseUrl);
    
    // Only allow same origin redirects
    return parsedUrl.origin === baseUrlParsed.origin;
    
  } catch (error) {
    console.error("Invalid callback URL:", url, error);
    return false;
  }
}

export const config = {
  // More specific matcher to avoid unnecessary middleware runs
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};