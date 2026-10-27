import { A } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { BROKEN_PATH } from "../puzzle";

const stored = () => {
  try { return localStorage.getItem("gdg-theme"); } catch { return null; }
};

export default function Navbar() {
  const [theme, setTheme] = createSignal<"light" | "dark">(stored() === "dark" ? "dark" : "light");

  createEffect(() => {
    document.documentElement.dataset.theme = theme();
    try { localStorage.setItem("gdg-theme", theme()); } catch {}
  });

  return (
    <header class="nav">
      <div class="wrap nav__row">
        <A href="/" class="brand">
          <span class="mark" aria-hidden="true"><img src="./favicon.svg" alt="GDG On Campus" class="brand__logo" /></span>
          <span>GDG <small>On Campus IIIT Kalyani</small></span>
        </A>
        <nav class="nav__links" aria-label="Primary">
          <A href="/" end activeClass="active">Home</A>
          <A href={BROKEN_PATH} activeClass="active"> Members</A>
          <button
            type="button"
            class="theme-btn"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label={`Switch to ${theme() === "light" ? "dark" : "light"} theme`}
          >
            {theme() === "light" ? "🌙" : "☀️"}
          </button>
        </nav>
      </div>
    </header>
  );
}
