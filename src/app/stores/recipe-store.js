// stores/recipe-store.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useRecipeStore = create(persist(
  (set) => ({
    userEmail: '',
    recipeRequest: '',
    inputs: {
      cuisine: '',
      flavorProfile: { spicy: 3, sweet: 3, healthy: 3 },
      servingSize: 2,
      skillLevel: 'beginner',
      timeAvailable: '30'
    },
    generatedRecipe: null,
    isLoading: false,
    error: null,

    // Actions
    setUserEmail: (email) => set({ userEmail: email }),
    setRecipeRequest: (request) => set({ recipeRequest: request }),
    setInputs: (inputs) => set({ inputs }),
    setGeneratedRecipe: (recipe) => set({ generatedRecipe: recipe }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    handleInputChange: (field, value) => set((state) => ({
      inputs: { ...state.inputs, [field]: value }
    })),
    clearAll: () => set({
      recipeRequest: '',
      inputs: {
        cuisine: '',
        flavorProfile: { spicy: 3, sweet: 3, healthy: 3 },
        servingSize: 2,
        skillLevel: 'beginner',
        timeAvailable: '30'
      },
      generatedRecipe: null
    })
  }),
  {
    name: 'recipe-storage',
  }
))