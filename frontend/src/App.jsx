// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.jsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     </>
// //   )
// // }

// // export default App


// import React, { useEffect, useState } from "react";
// import UploadArea from "./components/UploadArea";

// export default function App() {
//   const [theme, setTheme] = useState(() => {
//     try {
//       return localStorage.getItem("theme") || "auto";
//     } catch {
//       return "auto";
//     }
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const applied = theme === "auto" ? (prefersDark ? "dark" : "light") : theme;
//     root.setAttribute("data-theme", applied);
//     try { localStorage.setItem("theme", theme); } catch {}
//   }, [theme]);

//   return (
//     <div className="app-shell">
//       <header className="topbar">
//         <div className="brand">
//           <div className="logo">
//             <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
//               <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="url(#g)"/>
//               <defs>
//                 <linearGradient id="g" x1="0" x2="1">
//                   <stop offset="0" stopColor="#6EE7B7"/>
//                   <stop offset="1" stopColor="#3B82F6"/>
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
//           <div>
//             <h1>DocSumm</h1>
//             <p className="muted">Smart summaries for PDFs & scans — fast, private, and free</p>
//           </div>
//         </div>

//         <div className="controls">
//           <div className="theme-toggle" role="toolbar" aria-label="Theme">
//             <button
//               className={`chip ${theme === "light" ? "active" : ""}`}
//               onClick={() => setTheme("light")}
//               aria-pressed={theme === "light"}
//               title="Light mode"
//             >☀️ Light</button>

//             <button
//               className={`chip ${theme === "dark" ? "active" : ""}`}
//               onClick={() => setTheme("dark")}
//               aria-pressed={theme === "dark"}
//               title="Dark mode"
//             >🌙 Dark</button>

//             <button
//               className={`chip ${theme === "auto" ? "active" : ""}`}
//               onClick={() => setTheme("auto")}
//               aria-pressed={theme === "auto"}
//               title="Auto (system)"
//             >🖥️ Auto</button>
//           </div>
//         </div>
//       </header>

//       <main className="main">
//         <section className="left">
//           <div className="card large">
//             <h2>Upload & summarize</h2>
//             <p className="muted">Drop a PDF or scanned image, choose summary length, and get a clean, actionable summary.</p>
//             <UploadArea />
//           </div>
//         </section>

//         <aside className="right">
//           <div className="card small">
//             <h3>Tips for best results</h3>
//             <ul className="bullets">
//               <li>Use clear scans (≥ 200–300 DPI)</li>
//               <li>PDFs with selectable text give best results</li>
//               <li>Long documents are chunked automatically</li>
//             </ul>
//           </div>

//           <div className="card small">
//             <h3>Privacy</h3>
//             <p className="muted">All processing happens on your server. We don't send documents to paid external services by default.</p>
//           </div>
//         </aside>
//       </main>

//       <footer className="footer">
//         Built with ❤ — <span className="muted">React + FastAPI + Transformers</span>
//       </footer>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import UploadArea from "./components/UploadArea";

// export default function App() {
//   const [theme, setTheme] = useState(() => {
//     try {
//       return localStorage.getItem("theme") || "auto";
//     } catch {
//       return "auto";
//     }
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const applied = theme === "auto" ? (prefersDark ? "dark" : "light") : theme;
//     root.setAttribute("data-theme", applied);
//     try { localStorage.setItem("theme", theme); } catch {}
//   }, [theme]);

//   return (
//     <div className="app-shell">
//       <header className="topbar">
//         <div className="brand">
//           <div className="logo" aria-hidden>
//             <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
//               <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="url(#g)"/>
//               <defs>
//                 <linearGradient id="g" x1="0" x2="1">
//                   <stop offset="0" stopColor="#6EE7B7"/>
//                   <stop offset="1" stopColor="#3B82F6"/>
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
//           <div>
//             <h1>DocSumm</h1>
//             <p className="muted">Smart summaries for PDFs & scans — fast, private, and free</p>
//           </div>
//         </div>

//         <div className="controls">
//           <div className="theme-toggle" role="toolbar" aria-label="Theme">
//             <button className={`chip ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")} aria-pressed={theme === "light"} title="Light mode">☀️ Light</button>
//             <button className={`chip ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")} aria-pressed={theme === "dark"} title="Dark mode">🌙 Dark</button>
//             <button className={`chip ${theme === "auto" ? "active" : ""}`} onClick={() => setTheme("auto")} aria-pressed={theme === "auto"} title="Auto (system)">🖥️ Auto</button>
//           </div>
//         </div>
//       </header>

//       <main className="main">
//         <section className="left">
//           <div className="card large">
//             <h2>Upload & summarize</h2>
//             <p className="muted">Drop a PDF or scanned image, choose summary length, and get a clean, actionable summary.</p>
//             <UploadArea />
//           </div>
//         </section>

//         <aside className="right">
//           <div className="card small">
//             <h3>Tips for best results</h3>
//             <ul className="bullets">
//               <li>Use clear scans (≥ 200–300 DPI)</li>
//               <li>PDFs with selectable text give best results</li>
//               <li>Long documents are chunked automatically</li>
//             </ul>
//           </div>

//           <div className="card small">
//             <h3>Privacy</h3>
//             <p className="muted">All processing happens on your server. We don't send documents to paid external services by default.</p>
//           </div>
//         </aside>
//       </main>

//       <footer className="footer">
//         Built with ❤ — <span className="muted">React + FastAPI + Transformers</span>
//       </footer>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import UploadArea from "./components/UploadArea";
import ThemeMenu from "./components/ThemeMenu";

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "auto";
    } catch {
      return "auto";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const applied = theme === "auto" ? (prefersDark ? "dark" : "light") : theme;
    root.setAttribute("data-theme", applied);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="logo" aria-hidden>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="url(#g)"/>
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#6EE7B7"/>
                  <stop offset="1" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1>DocSumm</h1>
            <p className="muted">Smart summaries for PDFs & scans — fast, private, and free</p>
          </div>
        </div>

        <div className="controls">
          {/* Desktop chips (hidden on small screens via CSS) */}
          <div className="theme-toggle hidden-mobile" role="toolbar" aria-label="Theme">
            <button
              className={`chip ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
              title="Light mode"
            >☀️ Light</button>

            <button
              className={`chip ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
              title="Dark mode"
            >🌙 Dark</button>

            <button
              className={`chip ${theme === "auto" ? "active" : ""}`}
              onClick={() => setTheme("auto")}
              aria-pressed={theme === "auto"}
              title="Auto (system)"
            >🖥️ Auto</button>
          </div>

          {/* Mobile icon menu (visible only on small screens) */}
          <ThemeMenu theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <main className="main">
        <section className="left">
          <div className="card large">
            <h2>Upload & summarize</h2>
            <p className="muted">Drop a PDF or scanned image, choose summary length, and get a clean, actionable summary.</p>
            <UploadArea />
          </div>
        </section>

        <aside className="right">
          <div className="card small">
            <h3>Tips for best results</h3>
            <ul className="bullets">
              <li>Use clear scans (≥ 200–300 DPI)</li>
              <li>PDFs with selectable text give best results</li>
              <li>Long documents are chunked automatically</li>
            </ul>
          </div>

          <div className="card small">
            <h3>Privacy</h3>
            <p className="muted">All processing happens on your server. We don't send documents to paid external services by default.</p>
          </div>
        </aside>
      </main>

      <footer className="footer">
        Built by Swayam Singh — <span className="muted">React + FastAPI + Transformers</span>
      </footer>
    </div>
  );
}
