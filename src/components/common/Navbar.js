'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navLinks = [
        { name: 'Home', href: '/', isAuthRequired: false },
        { name: 'Documents', href: '/documents', isAuthRequired: true },
        { name: 'Applications', href: '/dashboard/applications', isAuthRequired: true },
        { name: 'Contact', href: '/contact', isAuthRequired: false },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Check authentication status
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAuth = () => {
        if (isAuthenticated) {
            // Logout
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        } else {
            // Navigate to login page
            router.push('/auth/login');
        }
    };

    const AuthButton = () => (
        <button
            onClick={handleAuth}
            className="text-gov-light hover:bg-gov-primary/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
        >
            {isAuthenticated ? 'Logout' : 'Login'}
        </button>
    );

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gov-dark/95 backdrop-blur-sm shadow-lg' : 'bg-gov-dark'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-gov-light font-bold text-xl flex items-center gap-2">
                            <Image src="/logo.png" alt="Gov Logo" width={40} height={40} />
                            संयुक्तPortal
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                (!link.isAuthRequired || link.isAuthRequired === isAuthenticated )&& (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`${pathname === link.href
                                                ? 'bg-gov-primary text-white'
                                                : 'text-gov-light hover:bg-gov-primary/80 hover:text-white'
                                            } px-3 py-2 rounded-md text-sm font-medium transition-all duration-300`}
                                    >
                                        {link.name}
                                    </Link>)
                            ))}
                            <AuthButton />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gov-light hover:text-white hover:bg-gov-primary/80 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="w-6 h-6 flex items-center justify-center">
                                <span
                                    className={`transform transition-all duration-300 w-5 h-0.5 bg-current absolute ${isOpen ? 'rotate-45' : '-translate-y-1.5'
                                        }`}
                                />
                                <span
                                    className={`transform transition-all duration-300 w-5 h-0.5 bg-current absolute ${isOpen ? 'opacity-0' : 'opacity-100'
                                        }`}
                                />
                                <span
                                    className={`transform transition-all duration-300 w-5 h-0.5 bg-current absolute ${isOpen ? '-rotate-45' : 'translate-y-1.5'
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64' : 'max-h-0'
                    } overflow-hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`${pathname === link.href
                                        ? 'bg-gov-primary text-white'
                                        : 'text-gov-light hover:bg-gov-primary/80 hover:text-white'
                                    } block px-3 py-2 rounded-md text-base font-medium`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div onClick={() => setIsOpen(false)}>
                            <AuthButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
