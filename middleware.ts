import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否为演示模式
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  // 如果是演示模式，跳过所有认证检查
  if (isDemoMode) {
    // 演示模式：允许访问所有页面
    // 但如果用户访问公开页面且有demo-session cookie，重定向到dashboard
    const demoSession = request.cookies.get("demo-session");
    const publicPaths = ["/", "/login", "/signup"];
    const isPublicPath = publicPaths.includes(pathname);

    if (isPublicPath && demoSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 正常模式：进行认证检查
  // 公开路由 - 不需要登录
  const publicPaths = ["/", "/login", "/signup"];
  const isPublicPath = publicPaths.includes(pathname);

  // 获取用户的认证状态
  const token = request.cookies.get("auth-token");

  if (!isPublicPath && !token) {
    // 如果访问受保护的路由但未登录，重定向到登录页
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath && token) {
    // 如果已登录用户访问公开页面，重定向到仪表板
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api路由
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon文件)
     * - public文件夹中的文件
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
