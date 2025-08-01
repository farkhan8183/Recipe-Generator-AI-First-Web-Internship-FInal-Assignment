'use client'
import { useRecipeStore } from '../../stores/recipe-store'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, animate, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond, Cinzel } from 'next/font/google'
import { FiCopy, FiShare2, FiBookmark, FiPrinter } from 'react-icons/fi'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})

export default function RecipeResults() {
  const { generatedRecipe, clearAll } = useRecipeStore()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Animation values
  const backgroundOpacity = useMotionValue(0)
  const cardOpacity = useMotionValue(0)
  const cardY = useMotionValue(20)
  const titleOpacity = useMotionValue(0)
  const titleY = useMotionValue(10)
  const metaOpacity = useMotionValue(0)
  const contentOpacity = useMotionValue(0)
  const backgroundPositionX = useMotionValue(0)
  const backgroundPositionY = useMotionValue(0)

  useEffect(() => {
    // Initial animations
    animate(backgroundOpacity, 1, { duration: 1.5 })
    animate(cardOpacity, 1, { duration: 0.8, delay: 0.5 })
    animate(cardY, 0, { duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] })
    animate(titleOpacity, 1, { duration: 0.6, delay: 1 })
    animate(titleY, 0, { duration: 0.6, delay: 1, ease: 'easeOut' })
    animate(metaOpacity, 1, { duration: 0.6, delay: 1.2 })
    animate(contentOpacity, 1, { duration: 0.6, delay: 1.4 })

    // Parallax effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      backgroundPositionX.set(x)
      backgroundPositionY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const backgroundImage = useMotionTemplate`radial-gradient(
    circle at calc(50% + ${backgroundPositionX}px) calc(50% + ${backgroundPositionY}px),
    #0a0a12 0%,
    #13182b 40%,
    #0a0a12 80%,
    #000000 100%
  )`

  const copyRecipe = () => {
    navigator.clipboard.writeText(generatedRecipe.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareRecipe = async () => {
    try {
      setIsSharing(true)
      if (navigator.share) {
        await navigator.share({
          title: generatedRecipe.title || 'Generated Recipe',
          text: generatedRecipe.content.split('Instructions:')[0],
          url: window.location.href
        })
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error('Error sharing:', err)
    } finally {
      setIsSharing(false)
    }
  }

 

  if (!generatedRecipe) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen overflow-hidden relative flex items-start justify-center p-4 pt-12 pb-20">
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
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-[150px]"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[150px]"
      />

      {/* Main content container */}
      <motion.div
        style={{ 
          opacity: cardOpacity,
          y: cardY
        }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Recipe card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-lg bg-gray-900/60 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Recipe header with meta info */}
          <div className="p-8 border-b border-white/10">
            <motion.div
              style={{ 
                opacity: titleOpacity,
                y: titleY
              }}
              className="mb-6"
            >
              <h1 className={`${cinzel.className} text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-3`}>
                {generatedRecipe.title || `${generatedRecipe.cuisine} Culinary Creation`}
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
              />
            </motion.div>

            {/* Meta info badges */}
            <motion.div
              style={{ opacity: metaOpacity }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <div className="flex items-center bg-amber-900/20 border border-amber-400/30 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-amber-200 font-medium">{generatedRecipe.skill}</span>
              </div>
              
              <div className="flex items-center bg-purple-900/20 border border-purple-400/30 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-purple-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-purple-200 font-medium">Serves: {generatedRecipe.serving}</span>
              </div>
              
              <div className="flex items-center bg-green-900/20 border border-green-400/30 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-green-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-200 font-medium">Time: {generatedRecipe.time} mins</span>
              </div>
            </motion.div>

            {/* Action buttons */}
                       {/* Action buttons - Revised */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white"
              >
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyRecipe}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white"
              >
                <FiCopy className="text-amber-400" />
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareRecipe}
                disabled={isSharing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white"
              >
                <FiShare2 className="text-blue-400" />
                {isSharing ? 'Sharing...' : 'Share'}
              </motion.button>
            </motion.div>
          </div>

          {/* Recipe content */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="p-8 space-y-8"
          >
            {/* Intro Section */}
            {generatedRecipe.content.includes('Intro:') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="bg-gray-800/30 p-6 rounded-xl border-l-4 border-amber-500/50"
              >
                <h3 className={`${cormorant.className} text-2xl font-semibold text-amber-100 mb-4`}>About This Creation</h3>
                <p className="whitespace-pre-line text-gray-200 leading-relaxed">
                  {generatedRecipe.content
                    .split('Intro:')[1]
                    ?.split('User-Centric Context:')[0]
                    ?.trim()
                    .replace(/\n+/g, '\n')}
                </p>
              </motion.div>
            )}
                        {/* Ingredients Section */}
            {generatedRecipe.content.includes('Ingredients:') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="bg-gray-800/40 p-6 rounded-xl border border-white/5"
              >
                <div className="flex items-center mb-6">
                  <h3 className={`${cormorant.className} text-2xl font-semibold text-white`}>Ingredients</h3>
                  <div className="ml-auto flex items-center bg-amber-900/20 rounded-full px-3 py-1">
                    <span className="text-xs text-amber-300">
                      {generatedRecipe.content
                        .split('Ingredients:')[1]
                        ?.split('Instructions:')[0]
                        ?.split('\n')
                        .filter(line => line.trim()).length} items
                    </span>
                  </div>
                </div>

                <ul className="space-y-4">
                  {generatedRecipe.content
                    .split('Ingredients:')[1]
                    ?.split('Instructions:')[0]
                    ?.split('\n')
                    .filter(line => line.trim())
                    .map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2 + i * 0.1 }}
                        className="flex items-start group"
                      >
                        <span className="relative mt-1 mr-4 flex-shrink-0">
                          <span className="absolute inset-0 w-5 h-5 bg-amber-400/20 rounded-full group-hover:bg-amber-400/30 transition-all"></span>
                          <span className="relative w-5 h-5 flex items-center justify-center">
                            <svg className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </span>
                        <span className="text-gray-200 group-hover:text-white transition-colors">
                          {item.replace(/^[-•\d\.\s]+/, '').trim()}
                        </span>
                      </motion.li>
                    ))}
                </ul>
              </motion.div>
            )}

            {/* Instructions Section */}
            {generatedRecipe.content.includes('Instructions:') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4 }}
                className="bg-gray-800/40 p-6 rounded-xl border border-white/5"
              >
                <h3 className={`${cormorant.className} text-2xl font-semibold text-white mb-6`}>Instructions</h3>
                <ol className="space-y-6">
                  {generatedRecipe.content
                    .split('Instructions:')[1]
                    ?.split('Final Message:')[0]
                    ?.split('\n')
                    .filter(step => step.trim())
                    .map((step, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.6 + i * 0.15 }}
                        className="flex group"
                      >
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm mt-0.5">
                          {i + 1}
                        </span>
                        <div className="pt-1">
                          <p className="text-gray-200 group-hover:text-white transition-colors">
                            {step.replace(/^\d+\.\s*/, '').trim()}
                          </p>
                          {i < generatedRecipe.content.split('Instructions:')[1].split('\n').filter(step => step.trim()).length - 1 && (
                            <motion.div 
                              className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 2.8 + i * 0.15 }}
                            />
                          )}
                        </div>
                      </motion.li>
                    ))}
                </ol>
              </motion.div>
            )}

            {/* Final Message */}
            {generatedRecipe.content.includes('Final Message:') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
                className="p-6 bg-gradient-to-r from-amber-900/10 to-orange-900/10 rounded-xl border-l-4 border-amber-500/70"
              >
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`${cormorant.className} text-amber-100 italic whitespace-pre-line leading-relaxed`}>
                    {generatedRecipe.content
                      .split('Final Message:')[1]
                      ?.trim()}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Create New Recipe Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard')}
            className={`${cinzel.className} px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg font-bold flex items-center`}
          >
            Craft Another Masterpiece
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}