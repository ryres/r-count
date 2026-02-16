import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Proteksi rute /dashboard
    if (pathname.startsWith('/dashboard')) {
        // Di real-world ini dicek via cookie atau token
        // Untuk mock, kita gunakan cara sederhana (meskipun sessionStorage hanya client-side, 
        // middleware ini lebih untuk demonstrasi struktur aplikasi yang benar)

        // Namun karena middleware berjalan di Edge Runtime, kita tidak bisa akses sessionStorage.
        // Kita anggap "auth" sukses jika ada cookie tertentu.
        const authCookie = request.cookies.get('auth_session');

        if (!authCookie && pathname !== '/login') {
            // return NextResponse.redirect(new URL('/login', request.url));
            // NOTE: Antigravity akan menggunakan pendekatan Client-Side protection di layout 
            // karena keterbatasan sistem mock auth tanpa server-side cookies.
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
