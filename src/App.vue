<template>
  <div>
    <nav
      v-if="isLoggedIn"
      class="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 z-50"
    >
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/activities" class="flex items-center space-x-2 group">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span class="text-white font-bold text-lg">A</span>
          </div>
          <span class="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">AQUARHÔNE</span>
        </router-link>

        <!-- Navigation -->
        <div class="flex items-center space-x-2">
          
          <!-- Historique -->
          <router-link
            to="/mes-reservations"
            class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Historique</span>
          </router-link>

          <!-- Réservations Admin -->
          <router-link
            v-if="isAdmin"
            to="/admin/reservations"
            class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <span>Réservations</span>
          </router-link>

          <!-- Ajouter activité Admin -->
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Ajouter activité</span>
          </router-link>

          <!-- Séparateur -->
          <div class="w-px h-6 bg-gray-300 mx-2"></div>

          <!-- Bouton de déconnexion -->
          <button
            class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
            @click="logout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>

    <div :class="isLoggedIn ? 'pt-24' : ''">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isAdmin = ref(false)
const isLoggedIn = ref(false)
const router = useRouter()

async function fetchUserInfo(token) {
  try {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (res.ok) {
      isAdmin.value = data.isAdmin
      isLoggedIn.value = true
    } else {
      isAdmin.value = false
      isLoggedIn.value = false
    }
  } catch {
    isAdmin.value = false
    isLoggedIn.value = false
  }
}

function logout() {
  localStorage.removeItem('token')
  isAdmin.value = false
  isLoggedIn.value = false
  router.push('/login')
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) fetchUserInfo(token)
})
</script>