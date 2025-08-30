// ThemeMenu.jsx
import React, { useState, useRef, useEffect } from "react";

/**
 * Mobile theme picker: an icon button that toggles a small dropdown with theme options.
 * Props:
 *  - theme: current theme value ("light"|"dark"|"auto")
 *  - setTheme: setter function
 */
export default function ThemeMenu({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const options = [
    { key: "light", label: "Light", emoji: "☀️" },
    { key: "dark", label: "Dark", emoji: "🌙" },
    { key: "auto", label: "Auto", emoji: "🖥️" }
  ];

  const handleSelect = (k) => {
    setTheme(k);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }} className="theme-menu-wrapper only-mobile">
      <button
        aria-haspopup="true"
        aria-expanded={open}
        className="theme-icon"
        onClick={() => setOpen(o => !o)}
        title="Theme"
      >
        {/* icon: show current theme small badge */}
        <span className="theme-icon-inner" aria-hidden>
          {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️"}
        </span>
      </button>

      {open && (
        <div className="theme-menu" role="menu" aria-label="Theme options">
          {options.map(opt => (
            <button
              key={opt.key}
              role="menuitem"
              onClick={() => handleSelect(opt.key)}
              className={`theme-menu-item ${theme === opt.key ? "selected" : ""}`}
            >
              <span className="theme-menu-emoji">{opt.emoji}</span>
              <span className="theme-menu-label">{opt.label}</span>
              {theme === opt.key && <span className="theme-menu-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
