import { For, Show } from "solid-js";
import MemberCard from "../components/MemberCard";
import { GROUPS, MEMBERS } from "../data/members";
import { reveal } from "../hooks/reveal";
import { checkSolved, FLAG } from "../puzzle";

export default function Members() {
  const solved = checkSolved();

  return (
    <>
      <Show when={solved}>
        <div class="toast" role="status">🎉 You found and fixed the routing bug! Flag: <b>{FLAG}</b></div>
      </Show>
      <section class="page-head wrap">
        <span class="pill" ref={reveal}>Our community</span>
        <h1 ref={reveal} style={{ "--d": "200ms" }}>Meet our members</h1>
        <p class="lead" ref={reveal} style={{ "--d": "400ms" }}>
          The students who organise events, build projects and make GDG On Campus what it is.
        </p>
      </section>

      <For each={GROUPS}>
        {(group) => (
          <section class="section wrap">
            <h2 ref={reveal}>{group}</h2>
            <div class="grid grid--3">
              <For each={MEMBERS.filter((m) => m.group === group)}>
                {(m, i) => <MemberCard member={m} index={i()} />}
              </For>
            </div>
          </section>
        )}
      </For>
    </>
  );
}
