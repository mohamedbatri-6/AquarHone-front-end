<template>
  <div class="max-w-3xl mx-auto mt-12 px-6">
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>

    <div v-else-if="error" class="text-center text-red-600 font-semibold">{{ error }}</div>

    <div v-else-if="activity">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">{{ activity.nom }}</h1>

      <p class="mb-2"><span class="font-semibold">Description :</span> {{ activity.description }}</p>
      <p class="mb-2"><span class="font-semibold">Type :</span> {{ activity.type }}</p>
      <p class="mb-2"><span class="font-semibold">Lieu :</span> {{ activity.lieu }}</p>
      <p class="mb-2"><span class="font-semibold">Prix :</span> {{ activity.prix }} €</p>
      <p class="mb-4"><span class="font-semibold">Places restantes :</span> {{ activity.placesRestantes }}</p>

      <h2 class="text-xl font-semibold mb-2">Créneaux disponibles</h2>
      <ul class="list-disc list-inside mb-6">
        <li v-for="(date, index) in activity.creneaux" :key="index">
          {{ new Date(date).toLocaleString() }}
        </li>
      </ul>

      <div v-if="isLoggedIn" class="border p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Réserver cette activité</h3>
        <form @submit.prevent="handleReservation" class="space-y-4 max-w-sm">
          <label>
            Date / Heure :
            <select v-model="selectedDate" required class="w-full border rounded px-2 py-1">
              <option disabled value="">Choisissez un créneau</option>
              <option v-for="(date, index) in activity.creneaux" :key="index" :value="date">
                {{ new Date(date).toLocaleString() }}
              </option>
            </select>
          </label>
          <label>
            Nombre de places :
            <input
              type="number"
              v-model.number="nombrePlaces"
              min="1"
              :max="activity.placesRestantes"
              required
              class="w-full border rounded px-2 py-1"
            />
          </label>

          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Réserver
          </button>

          <p v-if="reservationMessage" :class="{'text-green-600': reservationSuccess, 'text-red-600': !reservationSuccess}" class="mt-2">
            {{ reservationMessage }}
          </p>
        </form>
      </div>

      <div v-else class="text-center text-gray-500 italic mt-6">
        Connectez-vous pour pouvoir réserver cette activité.
      </div>
    </div>

    <div v-else>
      <p class="text-center text-gray-500 italic mt-8">Aucune donnée disponible pour cette activité.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const activity = ref(null);
const loading = ref(true);
const error = ref('');
const isLoggedIn = ref(false);
const selectedDate = ref('');
const nombrePlaces = ref(1);
const reservationMessage = ref('');
const reservationSuccess = ref(false);

const route = useRoute();

const fetchActivity = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(`http://localhost:5000/api/activities/${route.params.id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement');
    activity.value = data;
  } catch (err) {
    error.value = err.message || 'Impossible de charger l’activité';
  } finally {
    loading.value = false;
  }
};

const checkLogin = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

const handleReservation = async () => {
  reservationMessage.value = '';
  reservationSuccess.value = false;

  const token = localStorage.getItem('token');
  if (!token) {
    reservationMessage.value = 'Vous devez être connecté pour réserver.';
    return;
  }

  if (!selectedDate.value) {
    reservationMessage.value = 'Veuillez sélectionner un créneau.';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        activite: route.params.id,
        dateReservation: selectedDate.value,
        nombrePlaces: nombrePlaces.value
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la réservation');

    reservationMessage.value = 'Réservation effectuée avec succès !';
    reservationSuccess.value = true;

    // Mettre à jour les places restantes localement
    activity.value.placesRestantes -= nombrePlaces.value;
    selectedDate.value = '';
    nombrePlaces.value = 1;
  } catch (err) {
    reservationMessage.value = err.message;
  }
};

onMounted(() => {
  fetchActivity();
  checkLogin();
});
</script>
