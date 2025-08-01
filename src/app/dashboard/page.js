'use client'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})

export default function Welcome() {
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Animation values
  const backgroundPositionX = useMotionValue(0)
  const backgroundPositionY = useMotionValue(0)
  const backgroundOpacity = useMotionValue(0)
  const textOpacity = useMotionValue(0)
  const buttonScale = useMotionValue(0.9)

  useEffect(() => {
    let mounted = true

    // Start animations when component mounts
    if (user?.email) {
      animate(backgroundOpacity, 1, { duration: 1.5 })
      animate(textOpacity, 1, { duration: 1, delay: 0.5 })
      animate(buttonScale, 1, { 
        duration: 0.8,
        delay: 1,
        type: 'spring',
        bounce: 0.4
      })
    }

    // Parallax effect
    const handleMouseMove = (e) => {
      if (!mounted) return
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      backgroundPositionX.set(x)
      backgroundPositionY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      mounted = false
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [backgroundOpacity, textOpacity, buttonScale, backgroundPositionX, backgroundPositionY, user?.email])

  const backgroundImage = useMotionTemplate`radial-gradient(
    circle at calc(50% + ${backgroundPositionX}px) calc(50% + ${backgroundPositionY}px),
    #1a1a2e 0%,
    #16213e 30%,
    #0f3460 60%,
    #000000 100%
  )`

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user?.email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-black/50 rounded-lg">
          <p className="text-white">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: backgroundOpacity,
          backgroundImage
        }}
      />

      {/* Decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-amber-400 blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-orange-500 blur-3xl"
      />

      {/* Main content */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          type: 'spring',
          damping: 20,
          stiffness: 100,
          delay: 0.3
        }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="backdrop-blur-lg bg-black/40 rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8"
        >
          {/* Header */}
          <div className="mb-8 overflow-hidden">
            <motion.h1 
              className={`${cormorant.className} text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-4`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              RecipeCraft
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            />
          </div>

          {/* Welcome message */}
          <motion.p 
            className={`${cormorant.className} text-xl text-amber-100 mb-8`}
            style={{ opacity: textOpacity }}
          >
            Welcome back, <span className="text-white font-medium">{user.email}</span>
          </motion.p>

          {/* Main action button */}
          <motion.button
            style={{ scale: buttonScale, opacity: textOpacity }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/first')}
            className={`${cormorant.className} relative overflow-hidden w-full max-w-xs mx-auto py-4 px-6 text-lg font-bold text-black bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-xl mb-6`}
          >
            <span className="relative z-10">Let&apos;s Start Cooking</span>
            <motion.span
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl"
            >
              →
            </motion.span>
            <motion.div
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.button>

          {/* Footer with logout */}
          <motion.div 
            className="flex justify-between items-center pt-4 border-t border-white/10"
            style={{ opacity: textOpacity }}
          >
            <p className="text-sm text-white/50">
              Ready to create culinary magic
            </p>
            
            <motion.button
              onClick={handleLogout}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className={`${cormorant.className} text-sm bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-md`}
            >
              {isLoading ? 'Signing Out...' : 'Log Out'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}