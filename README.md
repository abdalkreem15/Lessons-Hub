# 🎓 LessonsHub (Private Lessons Platform)

A modern, ultra-fast, full-stack web application built for managing and booking private educational lessons. Designed with a clean responsive interface, dedicated teacher profiles, strict 1-on-1 scheduling, and a highly optimized serverless Google Sheets backend that bypasses traditional cloud function timeouts.

## 🚀 Tech Stack

* **Frontend / Framework:** Svelte 5 (using runes like `$state()`, `$derived()`, and `$effect()`)
* **Styling:** Tailwind CSS v4 (with Dark Mode support)
* **Language:** TypeScript
* **Database & API:** Google Apps Script Web App backed by Google Sheets (with salted SHA-256 password hashing & targeted data fetching)
* **Deployment:** Vercel-optimized (bypasses 10s serverless timeout limits)

## ✨ Features

* **Lightning-Fast Performance:** Engineered a 300% speed boost by implementing targeted API requests (e.g., `?type=teachers,bookings`) to avoid Vercel's serverless timeout limits and Google Apps Script cold starts.
* **Dedicated Teacher Profiles:** Clicking a teacher card opens a comprehensive profile page separating their availability, courses, and resources.
* **Strict 1-on-1 Private Scheduling:** Advanced time-slot parsing reads formatted strings (e.g., `10:00 AM (Mon, Wed)`) and generates individual bookable day buttons. Once a student books a specific day/time, it is instantly locked for everyone else.
* **Lightning Authentication:** Replaced heavy full-sheet object mapping with direct row-scanning (`findUserByEmailFast`) for sub-second login and registration responses.
* **Sticky Navigation & Views:** Client-side routing with a persistent, sticky top navbar for seamless switching between Home, Teachers Directory, About, and Contact views without losing context.
* **Cryptographic Security:** Secure registration and sign-in with SHA-256 password hashing and unique salts, safely stored via Google Apps Script.
* **Context-Aware Contact Form:** Utilizes the `mailto:` protocol to seamlessly open the user's native email app (Gmail, Outlook, Thunderbird), pre-filled with the message and user details.
* **Dark / Light Mode:** Fully responsive theme switcher utilizing Tailwind's dark mode classes and local storage persistence.

## 📂 Project Structure

```text
src/
├── lib/
│   └── components/
│       ├── About.svelte
│       ├── AuthModal.svelte         # Sign in / Register modal with day-based slot inputs
│       ├── ContactUs.svelte         # Native mailto: contact form trigger
│       ├── Home.svelte
│       ├── Subjects.svelte
│       ├── Teachers.svelte          # Teacher directory grid & subject filtering
│       └── TeacherProfile.svelte    # Individual teacher page, day/time parsing, & booking logic
├── routes/
│   ├── api/
│   │   └── data/
│   │       └── +server.ts           # Optimized SvelteKit API proxy handling targeted ?type= requests
│   ├── +page.svelte                 # Root component handling views, sticky nav, & global state
│   ├── +layout.svelte
│   └── +layout.css                  # Tailwind configuration
