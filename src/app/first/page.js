'use client'
import { useRecipeStore } from '.././stores/recipe-store'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})

export default function DescribeRecipe() {
  const { 
    recipeRequest, 
    setRecipeRequest,
    setUserEmail,
    error,
    setError,
    setGeneratedRecipe,
    setIsLoading
  } = useRecipeStore()
  const router = useRouter()
  
  // Animation values
  const backgroundOpacity = useMotionValue(0)
  const cardOpacity = useMotionValue(0)
  const cardY = useMotionValue(20)
  const textAreaOpacity = useMotionValue(0)
  const buttonScale = useMotionValue(0.95)
  const backgroundPositionX = useMotionValue(0)
  const backgroundPositionY = useMotionValue(0)

  // Memoized animation setup
  const initAnimations = useCallback(() => {
    animate(backgroundOpacity, 1, { duration: 1.2 })
    animate(cardOpacity, 1, { duration: 0.8, delay: 0.4 })
    animate(cardY, 0, { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] })
    animate(textAreaOpacity, 1, { duration: 0.6, delay: 0.8 })
    animate(buttonScale, 1, { duration: 0.5, delay: 1 })
  }, [backgroundOpacity, cardOpacity, cardY, textAreaOpacity, buttonScale])

  useEffect(() => {
    initAnimations()

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
  }, [initAnimations, backgroundPositionX, backgroundPositionY])

  const backgroundImage = useMotionTemplate`radial-gradient(
    circle at calc(50% + ${backgroundPositionX}px) calc(50% + ${backgroundPositionY}px),
    #0f172a 0%,
    #1e293b 40%,
    #0f172a 80%,
    #020617 100%
  )`

  // Check auth


  const generateBasicRecipe = async () => {
    if (!recipeRequest.trim()) {
      setError('Please enter a recipe request')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://primary-production-03db.up.railway.app/webhook/rec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeRequest }) 
      })

      if (!response.ok) throw new Error('Failed to generate recipe')

      const { recipe } = await response.json()
      setGeneratedRecipe(recipe)
      router.push('/dashboard/results')
      
    } catch (err) {
      setError(err.message || 'API error - try again later')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
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
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.5 }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-400 blur-[100px]"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-orange-500 blur-[100px]"
      />

      {/* Main card */}
      <motion.div
        style={{ 
          opacity: cardOpacity,
          y: cardY
        }}
        className="relative z-10 w-full max-w-2xl"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-lg bg-gray-900/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h1 className={`${cormorant.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-2`}>
              Craft Your Culinary Vision
            </h1>
            <p className="text-gray-400">
              Describe what you&apos;d like to create
            </p>
          </motion.div>

          {/* Textarea */}
          <motion.div
            style={{ opacity: textAreaOpacity }}
            className="relative mb-6"
          >
            <label className="block text-amber-100 mb-3 font-medium">
              Describe your recipe idea
            </label>
            <textarea
              value={recipeRequest}
              onChange={(e) => {
                setRecipeRequest(e.target.value)
                setError(null)
              }}
              placeholder={`e.g. A vibrant Thai curry with coconut milk and fresh basil\nOr a quick high-protein breakfast with eggs and avocado`}
              className="w-full p-4 border border-gray-700 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-40 placeholder-gray-500 resize-none"
            />
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2"
            />
          </motion.div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Buttons */}
          <div className="space-y-4">
            <motion.button
              style={{ scale: buttonScale }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/preferences')}
              disabled={!recipeRequest.trim()}
              className={`${cormorant.className} w-full py-4 px-6 rounded-lg font-medium text-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg transition-all ${
                !recipeRequest.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Refine Preferences →
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={generateBasicRecipe}
              disabled={!recipeRequest.trim()}
              className={`w-full py-3 px-6 rounded-lg font-medium text-amber-400 border border-amber-400/30 transition-all ${
                !recipeRequest.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Surprise Me - Generate Directly
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}