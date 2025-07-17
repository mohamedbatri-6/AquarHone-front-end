<template>
  <div class="max-w-6xl mx-auto mt-12 px-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Panneau Admin - Gestion des activités</h1>

    <!-- Formulaire ajout / modification -->
    <div class="bg-white p-6 rounded shadow mb-10">
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Modifier une activité' : 'Ajouter une activité' }}</h2>

      <form @submit.prevent="isEditing ? updateActivity() : createActivity()" class="space-y-4 max-w-lg">
        <input v-model="form.nom" type="text" placeholder="Nom" required class="w-full px-3 py-2 border rounded" />
        <textarea v-model="form.description" placeholder="Description" required class="w-full px-3 py-2 border rounded"></textarea>
        <input v-model="form.type" type="text" placeholder="Type (ex: kayak)" required class="w-full px-3 py-2 border rounded" />
        <input v-model="form.lieu" type="text" placeholder="Lieu" required class="w-full px-3 py-2 border rounded" />
        <input v-model.number="form.prix" type="number" placeholder="Prix (€)" required min="0" class="w-full px-3 py-2 border rounded" />
        <input v-model.number="form.placesRestantes" type="number" placeholder="Places restantes" required min="0" class="w-full px-3 py-2 border rounded" />
        
        <label>Créneaux disponibles (séparés par des virgules)</label>
        <input v-model="creneauxText" type="text" placeholder="Ex: 2025-07-20T10:00,2025-07-21T14:00" class="w-full px-3 py-2 border rounded" />

        <div class="flex gap-4">
          <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
          </button>
          <button v-if="isEditing" @click.prevent="cancelEdit" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des activités -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Liste des activités</h2>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-3 py-2 text-left">Nom</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Type</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Lieu</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Prix (€)</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Places restantes</th>
            <th class="border border-gray-300 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="act in activities" :key="act._id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-3 py-2">{{ act.nom }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ act.type }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ act.lieu }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ act.prix }}</td>
            <td class="border border-gray-300 px-3 py-2">{{ act.placesRestantes }}</td>
            <td class="border border-gray-300 px-3 py-2 flex gap-2 justify-center">
              <button @click="startEdit(act)" class="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white">Modifier</button>
              <button @click="deleteActivity(act._id)" class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
      <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activities = ref([]);
const error = ref('');
const successMessage = ref('');
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  nom: '',
  description: '',
  type: '',
  lieu: '',
  prix: 0,
  placesRestantes: 0,
  creneaux: []
});

const creneauxText = ref('');

const token = localStorage.getItem('token');

const fetchActivities = async () => {
  error.value = '';
  try {
    const res = await fetch('http://localhost:5000/api/activities', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement');
    activities.value = data;
  } catch (err) {
    error.value = err.message;
  }
};

const createActivity = async () => {
  error.value = '';
  successMessage.value = '';
  try {
    const creneauxArray = creneauxText.value
      .split(',')
      .map(d => new Date(d.trim()).toISOString())
      .filter(d => d); // filtre les entrées vides

    const res = await fetch('http://localhost:5000/api/activities', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...form.value, creneaux: creneauxArray }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la création');

    activities.value.push(data);
    successMessage.value = 'Activité ajoutée avec succès !';
    resetForm();
  } catch (err) {
    error.value = err.message;
  }
};

const startEdit = (act) => {
  isEditing.value = true;
  editId.value = act._id;
  form.value = {
    nom: act.nom,
    description: act.description,
    type: act.type,
    lieu: act.lieu,
    prix: act.prix,
    placesRestantes: act.placesRestantes,
    creneaux: act.creneaux
  };
  creneauxText.value = act.creneaux.map(d => new Date(d).toISOString()).join(',');
};

const cancelEdit = () => {
  resetForm();
  isEditing.value = false;
  editId.value = null;
};

const updateActivity = async () => {
  error.value = '';
  successMessage.value = '';
  try {
    const creneauxArray = creneauxText.value
      .split(',')
      .map(d => new Date(d.trim()).toISOString())
      .filter(d => d);

    const res = await fetch(`http://localhost:5000/api/activities/${editId.value}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...form.value, creneaux: creneauxArray }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');

    // Mettre à jour la liste localement
    const index = activities.value.findIndex(a => a._id === editId.value);
    if (index !== -1) activities.value[index] = data;

    successMessage.value = 'Activité mise à jour avec succès !';
    cancelEdit();
  } catch (err) {
    error.value = err.message;
  }
};

const deleteActivity = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer cette activité ?')) return;

  error.value = '';
  successMessage.value = '';

  try {
    const res = await fetch(`http://localhost:5000/api/activities/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression');

    activities.value = activities.value.filter(a => a._id !== id);
    successMessage.value = 'Activité supprimée avec succès !';
  } catch (err) {
    error.value = err.message;
  }
};

const resetForm = () => {
  form.value = {
    nom: '',
    description: '',
    type: '',
    lieu: '',
    prix: 0,
    placesRestantes: 0,
    creneaux: []
  };
  creneauxText.value = '';
};

onMounted(() => {
  fetchActivities();
});
</script>

<style scoped>
table th, table td {
  vertical-align: middle;
}
</style>
