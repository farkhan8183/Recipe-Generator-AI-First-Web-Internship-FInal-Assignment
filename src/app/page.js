'use client'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import { FiMail, FiArrowRight } from 'react-icons/fi'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})


export default function MagicLinkLogin() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoading, setIsLoading] = useState(false)
   const { signInWithMagicLink } = useAuth()
  // Animation values
  const backgroundOpacity = useMotionValue(0)
  const cardOpacity = useMotionValue(0)
  const cardY = useMotionValue(20)
  const buttonScale = useMotionValue(0.95)
  const backgroundPositionX = useMotionValue(0)
  const backgroundPositionY = useMotionValue(0)

  useEffect(() => {
    // Initial animations
    animate(backgroundOpacity, 1, { duration: 1.5 })
    animate(cardOpacity, 1, { duration: 0.8, delay: 0.5 })
    animate(cardY, 0, { duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] })
    animate(buttonScale, 1, { duration: 0.5, delay: 1 })

    // Parallax effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 30
      const y = (clientY / window.innerHeight - 0.5) * 30
      backgroundPositionX.set(x)
      backgroundPositionY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [backgroundOpacity, cardOpacity, cardY, buttonScale, backgroundPositionX, backgroundPositionY]) // Added all dependencies

  const backgroundImage = useMotionTemplate`radial-gradient(
    circle at calc(50% + ${backgroundPositionX}px) calc(50% + ${backgroundPositionY}px),
    #1a1a2e 0%,
    #16213e 30%,
    #0f3460 60%,
    #000000 100%
  )`

  
   const handleSubmit = (e) => {
    e.preventDefault()
    signInWithMagicLink(email)
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
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5 }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-400 blur-[100px]"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-orange-500 blur-[100px]"
      />

      {/* Main card */}
      <motion.div
        style={{ 
          opacity: cardOpacity,
          y: cardY
        }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-lg bg-gray-900/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Luxurious header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-center border-b border-white/10">
            <motion.h1 
              className={`${cormorant.className} text-4xl font-bold text-white mb-1`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              RecipeCraft
            </motion.h1>
            <motion.p 
              className="text-amber-100/80"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Your personal AI chef
            </motion.p>
          </div>

          <div className="p-8">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className={`${cormorant.className} text-2xl font-semibold text-white mb-1`}>Welcome back</h2>
              <p className="text-gray-400">Enter your email to continue</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setMessage({ text: '', type: '' })
                  }}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  disabled={isLoading}
                />
              </motion.div>

              <motion.button
                style={{ scale: buttonScale }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`${cormorant.className} relative overflow-hidden w-full py-4 px-6 rounded-lg font-medium text-white transition-colors text-lg ${
                  isLoading
                    ? 'bg-amber-500/80 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg'
                }`}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Continue 
                      <FiArrowRight className="inline ml-2" />
                    </>
                  )}
                </span>
                <motion.div
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </motion.button>

              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-md text-center text-sm border ${
                    message.type === 'error'
                      ? 'bg-red-900/30 border-red-700/50 text-red-200'
                      : 'bg-green-900/30 border-green-700/50 text-green-200'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </form>

            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-xs text-gray-500">
                By continuing, you agree to our <a href="#" className="text-amber-400 hover:underline">Terms</a> and <a href="#" className="text-amber-400 hover:underline">Privacy Policy</a>.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}