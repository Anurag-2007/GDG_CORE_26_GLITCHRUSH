import { A, useLocation } from "@solidjs/router";
import { onMount } from "solid-js";
import { noteBrokenLink } from "../puzzle";

export default function NotFound() {
  const loc = useLocation();
  onMount(() => noteBrokenLink(loc.pathname));

  return (
    <section class="page-head wrap nf">
      <span class="pill">Error 404</span>
      <h1>Page not found - ERROR 404</h1>
      <p class="lead">
        We couldn't find <code>{loc.pathname}</code>. Something's off, and the console / Developer tools of browser might know more 👀
      </p>
      <A href="/" class="btn">Back home</A>
    </section>
  );
}
