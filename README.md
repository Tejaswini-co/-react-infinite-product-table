# 🛍️ React Infinite Scroll Product Catalog

> A production-quality React application demonstrating frontend engineering fundamentals, custom infinite scroll, dynamic state management, and modern UI design. Built specifically for the Frontend Engineer Intern Assignment.

## 🚀 Live Demo & Links
- **Live Deployment:** [Insert Vercel URL Here]
- **Repository:** https://github.com/Tejaswini-co/-react-infinite-product-table

---

## 📖 Project Overview
This application serves as an interactive product dashboard. It securely fetches product data from a remote REST API and renders it inside a meticulously designed, purely custom HTML table. The project focuses heavily on **user experience (UX)** and **performance**, implementing an intersection-based infinite scrolling architecture to seamlessly load batches of data as the user explores the catalog.

## ✨ Key Features
- **Custom Infinite Scrolling:** Effortless pagination using the native `Intersection Observer API` without any unoptimized `onScroll` event listeners.
- **In-Place Inline Editing:** Users can interactively click and edit `Title` text seamlessly within the table rows, firing localized state updates dynamically.
- **Real-time Client Search:** Rapidly filter displayed inventory against Title, Brand, and Category identifiers.
- **Multi-Sort Table Headers:** Advanced multi-type data sorting (A-Z, High-Low) implemented strictly on vanilla frontend Javascript.
- **Micro-Interactions & UI Feedback:** Includes visual `Shimmer Skeletons` for premium loading states and animated `Toast Notifications` for successful state changes.

## 💻 Tech Stack
- **Framework:** React + Vite
- **Languages:** JavaScript (ES6+), HTML5
- **Styling:** Custom CSS3 (Flexbox/Grid, Animations, Glassmorphism)
- **APIs Used:** Fetch API, Intersection Observer API
- **Deployment:** Vercel

*Note: No third-party table libraries (like Material UI or React Table) were utilized in this build. The table is crafted strictly utilizing standard semantic DOM elements.*

---

## 🛠️ Project Structure

```text
src/
├── components/          
│   ├── ProductRow.jsx       # Micro-component managing individual tuple data/editing
│   └── ProductTable.jsx     # Macro-controller orchestrating hooks, arrays, and lists
├── hooks/               
│   └── useInfiniteScroll.js # Business logic driving IntersectionObserver rules
├── App.jsx                  # Root component instantiation
├── App.css                  # Global cascade definitions & animations
└── main.jsx                 # React DOM bindings
```

---

## ⚙️ Technical Explanations

### 1. API Usage & Pagination
Data is procured asynchronously from the public endpoint: `https://dummyjson.com/products`. 
We execute numerical mapping against `limit` and `skip` query parameters (`?limit=10&skip=X`). Rather than forcing the user to interact with tedious mathematical pagination menus, the `skip` mathematical interval automatically expands iteratively behind the scenes as data requests run.

### 2. Infinite Scrolling Architecture
The infinite scrolling mechanism is abstracted cleanly into its own declarative hook (`useInfiniteScroll`). By inserting an invisible "target" `div` cleanly at the bottom boundary of our table, the `Intersection Observer` mathematically observes the DOM. When this 1px boundary intersects with the active viewport margin, it immediately triggers the callback executing the next batch-fetch API call organically.

### 3. Error Handling & Loading States
All external asynchronous network requests execute within isolated `try/catch/finally` control blocks. 
* If network latency occurs, the user is visibly pacified via **Shimmer Skeleton** rows injected at the table's base. 
* If a critical fetch failure occurs (HTTP abort/timeout), the error message state elegantly renders a red-hued boundary box advising the user of the network disruption without fatally hard-crashing the web application view.

---

## 📦 Local Installation Instructions

To run this application natively on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tejaswini-co/-react-infinite-product-table.git
   cd react-infinite-product-table
   ```

2. **Initialize dependencies:**
   ```bash
   npm install
   ```

3. **Boot the Vite Development Server:**
   ```bash
   npm run dev
   ```

---

## 🌍 Deployment

This repository is optimized fundamentally for CI/CD free-tier workflows.

1. **Push to GitHub:** Code pushed successfully via `git push`.
2. **Import into Vercel:** Login to [Vercel](https://vercel.com/), select "Add Project", and choose this repository.
3. **Deploy Automatically:** Vercel natively detects the `Vite` environment and applies the required `npm run build` commands outputting to the `/dist` directory automatically without configuration scaling.

---

## 🔮 Future Improvements
If given more time on this sprint, I would look to implement:
- **Debounced Server-Side Searching:** Allowing the search bar to actively ping the API instead of filtering just the local front-end array.
- **Persistent Local Storage:** Saving user's "Title edits" directly to browser `localStorage` or `sessionStorage` so refreshing the Vite layout retains state modifications.
- **Unit Testing:** Implement `Vitest` and `React Testing Library` coverage covering API mock intercepts and the custom hook intersection tracking.
