<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-center mb-8">Toutes les réservations</h1>

    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-if="error" class="text-center text-red-600">{{ error }}</div>

    <div v-if="reservations.length && !loading" class="space-y-6">
      <div
        v-for="resv in reservations"
        :key="resv._id"
        class="bg-white rounded shadow p-6"
      >
        <h2 class="text-xl font-semibold">{{ resv.activite.nom }}</h2>
        <p><strong>Utilisateur :</strong> {{ resv.utilisateur.nom }} ({{ resv.utilisateur.email }})</p>
        <p><strong>Date réservée :</strong> {{ formatDate(resv.dateReservation) }}</p>
        <p><strong>Nombre de places :</strong> {{ resv.nombrePlaces }}</p>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center text-gray-500 italic mt-8">
      Aucune réservation trouvée.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reservations = ref([])
const loading = ref(true)
const error = ref('')
const userToken = localStorage.getItem('token') || null

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })
}

onMounted(async () => {
  if (!userToken) {
    error.value = 'Vous devez être connecté en tant qu\'admin.'
    loading.value = false
    return
  }

  try {
    const res = await fetch('http://localhost:5000/api/reservations', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement')
    reservations.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
