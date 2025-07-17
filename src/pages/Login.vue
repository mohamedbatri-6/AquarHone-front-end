<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Carte principale -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        
        <!-- En-tête -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Connexion</h2>
          <p class="text-gray-600 mt-2">Accédez à votre compte</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              v-model="motdepasse"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>

        </form>

        <!-- Séparateur -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <div class="text-center">
            <p class="text-gray-600 text-sm mb-3">Pas encore de compte ?</p>
            <button
              @click="goToRegister"
              class="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Créer un compte
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const motdepasse = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, motdepasse: motdepasse.value }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur de connexion')

    localStorage.setItem('token', data.token)
    router.push('/activities')
  } catch (err) {
    error.value = err.message
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>