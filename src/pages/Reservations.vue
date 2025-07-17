<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6 text-center">Mes réservations</h1>

    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-if="error" class="text-center text-red-600">{{ error }}</div>

    <div v-if="reservations.length && !loading">
      <ul class="space-y-4">
        <li
          v-for="resv in reservations"
          :key="resv._id"
          class="border rounded p-4 bg-white shadow"
        >
          <h2 class="text-xl font-semibold">{{ resv.activite.nom }}</h2>
          <p><strong>Date réservée :</strong> {{ formatDate(resv.dateReservation) }}</p>
          <p><strong>Nombre de places :</strong> {{ resv.nombrePlaces }}</p>
          <p><strong>Lieu :</strong> {{ resv.activite.lieu }}</p>
        </li>
      </ul>
    </div>

    <div v-else-if="!loading" class="text-center italic text-gray-500 mt-10">
      Vous n’avez aucune réservation.
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
    error.value = 'Vous devez être connecté.'
    loading.value = false
    return
  }

  try {
    const res = await fetch('http://localhost:5000/api/reservations/my', {
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
