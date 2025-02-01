import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gov-light">
      <h1 className="text-6xl font-bold text-gov-text mb-4">404</h1>
      <p className="text-xl text-gov-secondary mb-8">Oops! Page not found</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-gov-primary text-gov-light rounded-lg hover:bg-gov-secondary transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}