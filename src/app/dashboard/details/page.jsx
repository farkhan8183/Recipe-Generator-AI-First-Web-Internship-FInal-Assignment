'use client'
import { useRecipeStore } from '../../stores/recipe-store'
import { useRouter } from 'next/navigation'
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { useEffect } from 'react'
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})

export default function AdditionalOptions() {
  const { 
    inputs,
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
              Refine Your Preferences
            </h1>
            <p className="text-gray-400">
              Fine-tune your recipe specifications
            </p>
          </motion.div>

          {/* Flavor Profile Sliders */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-8 mb-10"
          >
            {[
              { id: 'spicy', label: 'Spice Level', minLabel: 'Mild', maxLabel: 'Spicy' },
              { id: 'sweet', label: 'Sweetness', minLabel: 'Savory', maxLabel: 'Sweet' },
              { id: 'healthy', label: 'Healthiness', minLabel: 'Indulgent', maxLabel: 'Healthy' }
            ].map((item) => (
              <div key={item.id} className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-amber-100 font-medium">{item.label}</label>
                  <span className="text-amber-400 font-mono text-sm bg-amber-900/30 px-2 py-1 rounded">
                    {inputs.flavorProfile[item.id]}/5
                  </span>
                </div>
                <div className="relative">
                  <motion.input
                    type="range"
                    min="1"
                    max="5"
                    value={inputs.flavorProfile[item.id]}
                    onChange={(e) => handleInputChange('flavorProfile', {
                      ...inputs.flavorProfile,
                      [item.id]: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-amber-500"
                    style={{
                      backgroundSize: `${(inputs.flavorProfile[item.id] - 1) * 25}% 100%`
                    }}
                    whileHover={{ scaleY: 1.5 }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                    <span>{item.minLabel}</span>
                    <span>Neutral</span>
                    <span>{item.maxLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Serving Size */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-10"
          >
            <label className="block text-amber-100 mb-3 font-medium">
              Serving Size
            </label>
            <div className="flex items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (inputs.servingSize > 1) {
                    handleInputChange('servingSize', inputs.servingSize - 1)
                  }
                }}
                className="w-10 h-10 rounded-l-lg bg-gray-800 flex items-center justify-center text-xl text-amber-400 border border-gray-700"
                disabled={inputs.servingSize <= 1}
              >
                −
              </motion.button>
              <div className="w-16 h-10 bg-gray-800 border-t border-b border-gray-700 flex items-center justify-center font-mono">
                {inputs.servingSize}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (inputs.servingSize < 2) {
                    handleInputChange('servingSize', inputs.servingSize + 1)
                  }
                }}
                className="w-10 h-10 rounded-r-lg bg-gray-800 flex items-center justify-center text-xl text-amber-400 border border-gray-700"
                disabled={inputs.servingSize >= 9}
              >
                +
              </motion.button>
              <span className="ml-3 text-gray-300 text-sm">people</span>
            </div>
          </motion.div>

          {/* Navigation buttons */}
          <motion.div 
            className="flex justify-between pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </motion.button>

            <motion.button
              style={{ scale: buttonScale }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/generate')}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center"
            >
              Review & Generate
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}