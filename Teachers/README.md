# 🎓 LessonsHub (Private Lessons Platform)

A modern, full-stack web application built for managing and booking private educational lessons. Designed with a clean responsive interface, user authentication, live schedule tracking, and a serverless Google Sheets backend database.

## 🚀 Tech Stack

- **Frontend / Framework:** Svelte 5 (using runes like `$state()`)
- **Styling:** Tailwind CSS v4 (with Dark Mode support)
- **Language:** TypeScript
- **Database & API:** Google Apps Script Web App backed by Google Sheets (with salted SHA-256 password hashing)
- **Deployment:** Vercel-ready

---

## ✨ Features

- **Dynamic Navigation & Views:** Client-side routing seamlessly toggles between Home, Teachers Directory, Subject Filters, About, and Contact Us views.
- **User Authentication:** Secure registration and sign-in with cryptographic password hashing (SHA-256 with salts) stored securely via Google Apps Script.
- **Interactive Booking System:** Students can browse teachers by subject, view real-time available time slots, and book sessions instantly. Taken slots automatically disable to prevent double-booking.
- **Context-Aware Contact Form:** Automatically populates and locks with the signed-in user's name and email, falling back to a manual form for guests.
- **Dark / Light Mode:** Fully responsive theme switcher utilizing Tailwind's dark mode classes and local storage persistence.

---

## 📂 Project Structure

```text
src/
├── lib/
│   └── components/
│       ├── About.svelte
│       ├── AuthModal.svelte       # Sign in / Register modal
│       ├── ContactUs.svelte       # Dynamic contact form
│       ├── Home.svelte
│       ├── Subjects.svelte
│       └── Teachers.svelte        # Teacher directory & booking logic
├── routes/
│   ├── api/
│   │   └── data/
│   │       └── +server.ts         # SvelteKit API route proxying Google Apps Script
│   ├── +page.svelte               # Root component handling views & global state
│   ├── +layout.svelte
│   └── +layout.css                # Tailwind configuration