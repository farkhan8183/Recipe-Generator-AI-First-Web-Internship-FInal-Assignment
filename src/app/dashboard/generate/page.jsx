'use client'
import { useRecipeStore } from '../../stores/recipe-store'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})

export default function GenerateRecipe() {
  const {
    recipeRequest,
    inputs,
    isLoading,
    error,
    setGeneratedRecipe,
    setIsLoading,
    setError,
    handleInputChange
  } = useRecipeStore()
  const router = useRouter()

  // Animation values
  const backgroundOpacity = useMotionValue(0)
  const cardOpacity = useMotionValue(0)
  const cardY = useMotionValue(20)
  const buttonScale = useMotionValue(0.95)
  const backgroundPositionX = useMotionValue(0)
  const backgroundPositionY = useMotionValue(0)

  useEffect(() => {
    // Initial animations
    animate(backgroundOpacity, 1, { duration: 1.2 })
    animate(cardOpacity, 1, { duration: 0.8, delay: 0.4 })
    animate(cardY, 0, { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] })
    animate(buttonScale, 1, { duration: 0.5, delay: 0.8 })

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
  }, [])

  const backgroundImage = useMotionTemplate`radial-gradient(
    circle at calc(50% + ${backgroundPositionX}px) calc(50% + ${backgroundPositionY}px),
    #0f172a 0%,
    #1e293b 40%,
    #0f172a 80%,
    #020617 100%
  )`

  const generateRecipe = async () => {
    if (!recipeRequest.trim()) {
      setError('Please enter a recipe request')
      return false
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://primary-production-03db.up.railway.app/webhook/rec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recipeRequest,
          cuisine: inputs.cuisine,
          flavorProfile: inputs.flavorProfile,
          servingSize: inputs.servingSize,
          skillLevel: inputs.skillLevel,
          timeAvailable: inputs.timeAvailable
        }) 
      })

      if (!response.ok) throw new Error('Failed to generate recipe')

      const { recipe } = await response.json()
      setGeneratedRecipe(recipe)
      return true
      
    } catch (err) {
      setError(err.message || 'API error - try again later')
      console.error(err)
      return false
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
              Finalize Your Recipe
            </h1>
            <p className="text-gray-400">
              Adjust these final parameters for perfect results
            </p>
          </motion.div>

          {/* Skill Level */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <label className="block text-amber-100 mb-3 font-medium">
              Chef Skill Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['beginner', 'intermediate', 'pro'].map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('skillLevel', level)}
                  className={`p-3 rounded-lg border transition-all capitalize ${
                    inputs.skillLevel === level
                      ? 'border-amber-400 bg-amber-500/10 text-amber-100 shadow-lg'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {level}
                  {inputs.skillLevel === level && (
                    <motion.div 
                      layoutId="skillIndicator"
                      className="mt-2 h-0.5 bg-amber-400 rounded-full"
                      initial={false}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Time Available */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-10"
          >
            <label className="block text-amber-100 mb-3 font-medium">
              Cooking Time
            </label>
            <div className="relative">
              <select
                value={inputs.timeAvailable}
                onChange={(e) => handleInputChange('timeAvailable', e.target.value)}
                className="w-full p-4 border border-gray-700 bg-gray-800/50 text-white rounded-lg appearance-none cursor-pointer"
              >
                <option value="15">Quick (15 mins)</option>
                <option value="30">Medium (30 mins)</option>
                <option value="45">Long (45 mins)</option>
                <option value="60">Extended (60+ mins)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.button
            style={{ scale: buttonScale }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              const success = await generateRecipe()
              if (success) router.push('/dashboard/results')
            }}
            disabled={!recipeRequest.trim() || isLoading}
            className={`${cormorant.className} relative overflow-hidden w-full py-4 px-6 rounded-lg font-medium text-white transition-colors text-lg ${
              isLoading
                ? 'bg-amber-500/80 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg'
            }`}
          >
            <span className="relative z-10">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Crafting Your Recipe...
                </span>
              ) : 'Generate Masterpiece'}
            </span>
            <motion.div
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-md bg-red-900/30 border border-red-700/50 text-red-200 text-center text-sm"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}