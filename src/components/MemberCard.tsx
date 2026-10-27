import { createSignal, Show } from "solid-js";
import { imageFor } from "../data/members";
import type { Member } from "../data/members";
import { reveal } from "../hooks/reveal";

const COLORS = ["blue", "red", "yellow", "green"];
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

export default function MemberCard(props: { member: Member; index: number }) {
  const [failed, setFailed] = createSignal(false);
  const src = () => (failed() ? undefined : imageFor(props.member));

  return (
    <article
      class={`card member c-${COLORS[props.index % 4]}`}
      ref={reveal}
      style={{ "--d": `${(props.index % 3) * 150}ms` }}
    >
      <Show when={src()} fallback={<span class="avatar" aria-hidden="true">{initials(props.member.name)}</span>}>
        <img
          class="avatar avatar--img"
          src={src()}
          alt={`Photo of ${props.member.name}`}
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </Show>
      <h3>{props.member.name}</h3>
      <p>{props.member.role}</p>
    </article>
  );
}
