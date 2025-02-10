# Ride-Hailing Admin Dashboard

## Project Description

Ride-Hailing Admin Dashboard is a web-based application built using **Next.js, TypeScript, Ant Design, and Tailwind CSS**. It provides administrators with the ability to manage ride bookings, monitor driver activity, and oversee user interactions efficiently.

## Features Overview

- **Booking Management:** Create, update, and delete ride bookings, search, filtering.
- **Driver Management:** Manage basic information drivers and completed trips, ratings, and customer comments for drivers.
- **User Authentication:** Secure login system with role-based access control (admin & staff).
- **Activity Log** Save user activities in managing bookings such as creating, editing, and deleting,

## Live Demo

The project is deployed on **Vercel**. You can access the live demo using the following link: [Live Demo](https://ride-hailing-admin-dashboard-beta.vercel.app/)

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS, Ant Design
- **State Management:** React Query, Recoil
- **Database:** Upstash Redis
- **Authentication:** NextAuth.js

## 🛠 Setup Instructions

Follow these steps to set up the project locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/HuyZzz1/ride-hailing-admin-dashboard.git
cd ride-hailing-admin-dashboard
```

### 2️⃣ Install Dependencies

```bash
yarn install
# or
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```
NEXTAUTH_SECRET=C5ZweogNeKiW3wqk7D+DQFjGvWvvgUtiCFVUNvaAn2o=
UPSTASH_REDIS_REST_URL=https://legible-hare-12834.upstash.io
UPSTASH_REDIS_REST_TOKEN=ATIiAAIjcDEwMWI5M2U4Zjk3NDM0MzIxODU5MDVlMGNiM2RjMzE1Y3AxMA
```

### 4️⃣ Run the Development Server

```bash
yarn dev
# or
npm run dev
```

###  Account

Admin: email:admin@gmail.com  password:123123
Account Staff: email:staff@gmail.com  password:123123

Visit (http://localhost:3000) to view the project.

## 📜 API Documentation

### Authentication API

- `POST /api/auth/signin` - Login endpoint

### User API

- `POST /api//users/me` - Retrieve all info user

### Bookings API

- `POST /api/bookings` - Retrieve all bookings
- `POST /api/bookings/create` - Create a new booking
- `PUT /api/bookings/edit` - Update booking details
- `POST /api/bookings/delete` - Delete a booking
- `POST /api/bookings/delete-multiple` - Delete Multiple bookings

### Drivers API

- `POST /api/drivers` - Retrieve all bookings

### Activity Log API

- `POST /api/audit-trail` - Retrieve all activity log
