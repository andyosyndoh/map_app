# 🌍 MapApp

A Ruby on Rails + React + Inertia.js web app for users to add and manage geolocation-based locations. Admins can manage users and view dashboard insights.

---

## ⚙️ Tech Stack

- **Backend**: Ruby on Rails
- **Frontend**: React (via Inertia.js)
- **Auth**: Devise
- **Roles**: User / Admin

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/andyosyndoh/map_app.git
cd map_app
```

### 2. Install dependencies

#### 🔧 Backend (Rails)

```bash
bundle install
```

#### 💡 Frontend (Node + Vite)

```bash
yarn install
```

> If you don’t have Yarn:
```bash
npm install -g yarn
```

### 3. Setup database

```bash
rails db:create
rails db:migrate
```

> Optional: Load seed data if available
```bash
rails db:seed
```

---

## 👤 User Authentication

Devise is used for authentication.

- Visit `/users/sign_up` to register
- Visit `/users/sign_in` to log in
- Logout via the "Logout" button in the navbar

Admin users can access the dashboard via `/admin/dashboard`.

---

## 🧪 Run the app

### In development:

```bash
# Start Rails server
rails s
```
or

```bash

./bin/dev

```

```bash
# In a separate terminal, run Vite for React components
yarn dev
```

Then visit: `http://localhost:3000`

---


## 📂 File Structure Highlights

```
app/
├── controllers/
│   ├── locations_controller.rb
│   └── admin/
│       └── admin_controller.rb
├── javascript/
│   └── Pages/             # Inertia React pages
│   └── Layout.jsx         # React layout
└── views/devise/          # Devise views (for auth)
```

---

## 🛡 Admin Panel

Admin routes are namespaced under `/admin`.

- `/admin/dashboard`
- `/admin/users`
- Admins can create, edit, and delete users.

---

## 🧼 Troubleshooting

To reset the DB:

```bash
rails db:drop db:create db:migrate
```

---

## 📜 License

MIT — free to use, modify, and distribute.

---

## 🙌 Contributions

Pull requests are welcome. For major changes, please open an issue first.

