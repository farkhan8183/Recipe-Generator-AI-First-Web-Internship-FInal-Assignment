'use client'
import Auth from '@/components/Auth'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Magic Link Authentication
      </h1>
      {!user ? <Auth /> : null}
    </main>
  )
}