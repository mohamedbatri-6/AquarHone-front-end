<template>
  <div class="max-w-6xl mx-auto mt-8 px-4">
    <h1 class="text-3xl font-bold text-center mb-8">Activités</h1>

    <div v-if="isAdmin" class="text-right mb-6">
      <router-link
        to="/admin"
        class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
      >
        + Ajouter une activité
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Chargement...</div>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <div v-if="activities.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="activity in activities"
        :key="activity._id"
        class="bg-white border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
      >
        <h2 class="text-xl font-bold mb-3 text-gray-800">{{ activity.nom }}</h2>
        
        <div class="space-y-2 mb-4">
          <p class="text-gray-600">
            <span class="font-medium">Type:</span> {{ activity.type }}
          </p>
          <p class="text-gray-600">
            <span class="font-medium">Lieu:</span> {{ activity.lieu }}
          </p>
          <p class="text-gray-600">
            <span class="font-medium">Prix:</span> {{ activity.prix }} €
          </p>
          <p class="text-gray-600">
            <span class="font-medium">Places restantes:</span> 
            <span class="font-bold text-green-600">{{ activity.placesRestantes }}</span>
          </p>
        </div>

        <div class="space-y-3">
          <router-link
            :to="`/activities/${activity._id}`"
            class="block w-full bg-gray-700 hover:bg-gray-800 text-white text-center py-2 px-4 rounded"
          >
            Voir détails
          </router-link>

          <div v-if="isAdmin" class="flex gap-2">
            <router-link
              :to="`/admin/edit/${activity._id}`"
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-center py-2 px-2 rounded text-sm"
            >
              Modifier
            </router-link>
            <button
              @click="deleteActivity(activity._id)"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-2 rounded text-sm"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center py-12">
      <p class="text-gray-500 text-lg">Aucune activité disponible</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const activities = ref([]);
const loading = ref(true);
const error = ref('');
const isAdmin = ref(false);
const router = useRouter();

const fetchActivities = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('http://localhost:5000/api/activities');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement');
    activities.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const checkAdmin = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    isAdmin.value = false;
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    isAdmin.value = data.isAdmin;
  } catch {
    isAdmin.value = false;
  }
};

const deleteActivity = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer cette activité ?')) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Vous devez être connecté en tant qu\'administrateur');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/activities/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Erreur lors de la suppression');
    }
    activities.value = activities.value.filter(a => a._id !== id);
    alert('Activité supprimée');
  } catch (err) {
    alert('Erreur : ' + err.message);
  }
};

onMounted(async () => {
  await checkAdmin();
  await fetchActivities();
});
</script>