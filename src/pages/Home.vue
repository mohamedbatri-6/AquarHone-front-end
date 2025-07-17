<template>
  <div class="text-center mt-10 space-y-6">
    <h1 class="text-3xl font-bold text-blue-600">Bienvenue sur Aqua Rhône 🌊</h1>

    <div class="flex justify-center gap-4">
      <router-link to="/login">
        <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Se connecter
        </button>
      </router-link>

      <router-link to="/register">
        <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
          S'inscrire
        </button>
      </router-link>
    </div>
  </div>
</template>
