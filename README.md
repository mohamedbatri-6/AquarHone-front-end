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

  
![login](https://github.com/user-attachments/assets/83abfd22-e33a-44cd-b626-e6f5a7f170b5)


![register](https://github.com/user-attachments/assets/9fbe0407-64ac-486b-b31f-7e2d25db9efa)


![RESERVATIONS](https://github.com/user-attachments/assets/1676dbd4-9c69-447b-ad58-2f24e2ed9753)


![tout les reservation](https://github.com/user-attachments/assets/fb2641ce-aef0-414c-9df5-3a5d094a8a7f)


![HISTORIQUE](https://github.com/user-attachments/assets/34fb02b5-c6e1-4846-b540-2b099cea8fee)


![ajouté une activité](https://github.com/user-attachments/assets/3e30f7d2-6ef7-406f-a49f-94b05f3a321d)


![ajouter une activité 2](https://github.com/user-attachments/assets/223e2dd7-9b43-4da1-9c97-818ea4d7b22e)




