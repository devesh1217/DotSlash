'use client'
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Add admin header/navigation here if needed */}
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}
