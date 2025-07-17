<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Carte principale -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        
        <!-- En-tête -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Créer un compte</h2>
          <p class="text-gray-600 mt-2">Rejoignez-nous dès maintenant</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <!-- Nom -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              v-model="nom"
              type="text"
              placeholder="Votre nom"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>

          <!-- Message d'erreur -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Bouton d'inscription -->
          <button
            type="submit"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            S'inscrire
          </button>

        </form>

        <!-- Séparateur -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <div class="text-center">
            <p class="text-gray-600 text-sm mb-3">Déjà un compte ?</p>
            <button
              @click="goToLogin"
              class="text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Se connecter
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

const nom = ref('')
const email = ref('')
const motdepasse = ref('')
const error = ref('')
const router = useRouter()

const handleRegister = async () => {
  error.value = ''
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: nom.value,
        email: email.value,
        motdepasse: motdepasse.value,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la création du compte')

    router.push('/login')
  } catch (err) {
    error.value = err.message
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>