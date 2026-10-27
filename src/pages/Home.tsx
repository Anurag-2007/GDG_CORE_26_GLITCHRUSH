import { A } from "@solidjs/router";
import { For } from "solid-js";
import { BROKEN_PATH } from "../puzzle";

const FEATURES = [
  { c: "blue", title: "Learn", text: "Workshops and study jams on web, Android, cloud and AI." },
  { c: "red", title: "Build", text: "Team projects and hack nights where ideas become working apps." },
  { c: "yellow", title: "Connect", text: "Meet developers, mentors and speakers from the Google ecosystem." },
  { c: "green", title: "Grow", text: "Prepare for internships and careers with real-world experience." },
];

export default function Home() {
  return (
    <>
      <section class="hero wrap">
        <div>
          <span class="pill">Google Developer Groups · On Campus</span>
          <h1>Learn. Build. <span class="grad">Grow together.</span></h1>
          <p class="lead">
            A student community for anyone curious about technology. No experience needed, just
            bring your curiosity.
          </p>
          <div class="cta">
            <A href={BROKEN_PATH} class="btn">Meet the members</A>
            <a href="#what-we-do" class="btn btn--ghost">What we do</a>
          </div>
        </div>
        <div class="shapes" aria-hidden="true">
          <span class="s s1" /><span class="s s2" /><span class="s s3" /><span class="s s4" />
        </div>
      </section>

      <section id="what-we-do" class="section wrap">
        <h2>What we do</h2>
        <div class="grid grid--4">
          <For each={FEATURES}>
            {(f) => (
              <article class={`card feature c-${f.c}`}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            )}
          </For>
        </div>
      </section>

      <section class="section wrap">
        <div class="band">
          <h2>Ready to join?</h2>
          <p>See who is behind the community and say hello.</p>
          <A href={BROKEN_PATH} class="btn">View members</A>
        </div>
      </section>
    </>
  );
}
