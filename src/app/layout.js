import { AuthProvider } from '@/context/AuthContext'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Magic Link Auth',
  description: 'Authentication with Magic Links using Next.js and Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AuthProvider>
          {/* Client component rendered in server component */}
          <ToasterClient />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

// Create a separate client component for Toaster
function ToasterClient() {
  return <Toaster position="top-right" />
}