# Jídelníček

A full-stack web application that helps users plan meals based on what they have in their fridge. Built as a university project for the VWA (Web Application Development) course at Mendel University.

## What it does

- **Fridge management** — keep track of ingredients you have at home
- **Shopping list** — add things you need to buy; checking an item moves it back into the fridge
- **Recipe search** — find recipes that match your fridge ingredients, with filters (diet, cooking time, meal type)
- **Cookbook** — save recipes for later, mark favorites
- **AI Chef** — chat with an AI that suggests recipes based on what's in your fridge
- **User profiles** — sign up with email or Google, edit profile

## Tech stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **Auth & database:** Firebase Authentication + Firestore
- **AI:** Groq SDK (Llama 3.1 8B)
- **Recipes data:** Spoonacular API
- **Container:** Docker (multi-stage build)

## External APIs

1. **Spoonacular** — random recipes, complex search, recipe details, ingredient autocomplete
2. **Groq** — LLM-powered chat
3. **Firebase** — Auth + Firestore (real-time noSQL database)

## Project structure

```
app/
├── (auth)/           # login, register (route group, no URL prefix)
├── api/chat/         # server-side Groq API proxy
├── chat/             # AI Chef page
├── components/       # shared UI components
├── context/          # AuthContext (React Context for current user)
├── fridge/           # fridge page
├── home/             # home page (SSR)
├── profile/          # profile + edit
├── recipes/          # cookbook, search, recipe detail
├── shoppingList/
├── layout.tsx        # root layout
└── page.tsx          # root (redirects to /login)

components/ui/        # shadcn/ui components (Button, Card, Input, ...)
hooks/                # custom React hooks
lib/                  # firebase config, fetcher, utils
```

## Setup

### Requirements
- Node.js 20+
- Firebase project (Auth + Firestore enabled)
- Spoonacular API key
- Groq API key


### Local development

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
npm start
```

## Docker

The app ships with a multi-stage Dockerfile (deps → builder → runner) based on `node:20-alpine`.

## Firestore data model

```
fridge/{docId}                          → { name, amount, unit, createdAt, userId }
shoppingList/{docId}                    → { name, amount, unit, createdAt, userId }
users/{userId}                          → { name, surname, email, imageUrl, createdAt }
users/{userId}/savedRecipes/{recipeId}  → { title, image, readyInMinutes, favorite, downloadedAt }
```

Each fridge / shopping list item is scoped to a user via `userId`; saved recipes live in a subcollection under each user.

## Authors

[David Ježek](https://github.com/dajvidsh)

[Jan Hvozdovič](https://github.com/JanK0cZ)

[Tomáš Boba](https://github.com/grumbajzik) 

Mendel University, VWA course.