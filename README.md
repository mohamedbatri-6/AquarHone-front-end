## 🔹 PARTIE FRONTEND

### 📌 Description

Frontend de l'application **AquaRhône** construit avec **Vue 3**, **Tailwind CSS**, et Vue Router. Il consomme l’API du backend pour afficher les activités et gérer les réservations.

### 🚀 Fonctionnalités principales

- Authentification utilisateur (login/register)
- Stockage du token JWT dans le `localStorage`
- Affichage des activités
- Réservation en ligne
- Dashboard admin (gestion des activités)
- UI responsive et moderne (TailwindCSS)

### 📁 Structure

```
frontend/
├── src/
│   ├── assets/              
│   ├── components/          
│   ├── pages/              
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Activities.vue
│   │   ├── ActivityDetail.vue
│   │   ├── AdminPanel.vue
│   │   ├── Reservations.vue
│   │   └── adminReservations.vue
│   ├── router/              
│   ├── store/              
│   ├── App.vue              
│   └── main.js              
├── index.html              
├── package.json             
└── vite.config.js           

```

### ⚙️ Installation

#### 🔸 Prérequis

- Node.js v16+
- npm ou yarn

#### 🔸 Étapes

1. Accéder au dossier `frontend` :
```bash
cd frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur Nuxt :
```bash
npm run dev
```

Le frontend est accessible sur :  
👉 `http://localhost:3000`

### 🔑 Authentification

- Envoi d'un `POST` à `/api/auth/login`
- Stockage du token JWT dans `localStorage`
- Ajout du token dans les headers pour les requêtes protégées

### 📄 Pages principales

- `/login` → Connexion
- `/register` → Création de compte
- `/activities` → Liste des activités
- `/activitiesDetail` → Détails + réservation
- `/adminReservation` → Gestion des activités (admin)
