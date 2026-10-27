import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { checkSolved, FLAG } from "../puzzle";

/* ------------------------------------------------------------------ */
/* PHOTOS                                                              */
/* Reads every image in <project root>/images/photos (your folder).    */
/* Each photo is matched to a member by the name in its file name,     */
/* so "Karan - Management lead.jpg" -> Karan Kumar.                    */
/* If your folder lives somewhere else, change ONLY the path below.    */
/* ------------------------------------------------------------------ */
const PHOTO_FILES = import.meta.glob<{ default: string }>(
  "../../images/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true },
);

const tokens = (s: string): string[] =>
  s
    .normalize("NFKD") // turns fancy fonts like 𝑃𝑟𝑎𝑠ℎ𝑎𝑛𝑡 into plain letters
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const PHOTOS = Object.entries(PHOTO_FILES).map(([path, mod]) => ({
  tokens: tokens((path.split("/").pop() || "").replace(/\.[^.]+$/, "")),
  url: mod.default,
}));

function findPhoto(name: string): string | undefined {
  const t = tokens(name);
  let best: string | undefined;
  let bestScore = 0;
  for (const p of PHOTOS) {
    if (!p.tokens.includes(t[0])) continue; // first name must match exactly
    const score = t.filter((x) => p.tokens.includes(x)).length;
    if (score > bestScore) {
      bestScore = score;
      best = p.url;
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */
const ROSTER: [string, string][] = [
  ["Management Lead", "Karan Kumar"],
  ["Management Lead", "Prashant Raj"],
  ["Creative Lead", "Joyjit Deb"],
  ["Creative Lead", "Arkashma Seal"],
  ["Web Dev Lead", "Ayonava Ghosh"],
  ["App Dev Lead", "Debabrata Mandal"],
  ["App Dev Lead", "Anshumaan Sharma"],
  ["AI/ML Lead", "Ayush Lahiri"],
  ["AI/ML Lead", "Rishav Sarkar"],
  ["Blockchain Lead", "Subhra Sekhar Garai"],
  ["Public Relations Lead", "Harsh Raj"],
  ["Public Relations Lead", "Soma Das"],
  ["Media and Outreach Lead", "Agnik Das"],
  ["Media and Outreach Lead", "Saina Pal"],
  ["Women in Tech Lead", "Anusha Muhuri"],
  ["Women in Tech Lead", "Alka Verma"],
  ["Extended Core Member", "Anuskaa Ghosh"],
  ["Extended Core Member", "Abhya Kumari"],
  ["Extended Core Member", "Anshu Ranjan"],
  ["Extended Core Member", "Koshik Ray"],
];

interface Theme {
  c1: string; // light end (bottom of card)
  c2: string; // dark end (top of card)
  tint: string; // light shade used for the name
  glow: string;
}

// GDG colours: red, blue, yellow, green
const THEMES: Theme[] = [
  { c1: "#FF8076", c2: "#A5211A", tint: "#FFD6D2", glow: "rgba(234,67,53,.55)" },
  { c1: "#6FA8FF", c2: "#1747B0", tint: "#D3E3FF", glow: "rgba(66,133,244,.55)" },
  { c1: "#FFCF3F", c2: "#B85400", tint: "#FFF0B8", glow: "rgba(251,188,4,.6)" },
  { c1: "#58D07A", c2: "#0F5F2C", tint: "#D5F6DF", glow: "rgba(52,168,83,.55)" },
];

interface Member {
  name: string;
  photo?: string;
  doodle: number;
  fs: number; // name font size in cqw (shrinks for long words)
}
interface Role {
  title: string;
  theme: Theme;
  members: Member[];
}

const ROLES: Role[] = [];
ROSTER.forEach(([position, name]) => {
  let role = ROLES.find((r) => r.title === position);
  if (!role) {
    role = { title: position, theme: THEMES[ROLES.length % THEMES.length], members: [] };
    ROLES.push(role);
  }
  const longest = Math.max(...name.split(" ").map((w) => w.length));
  role.members.push({
    name,
    photo: findPhoto(name),
    doodle: (ROLES.length + role.members.length) % 4,
    fs: Math.max(4.4, Math.min(7.4, 52 / longest)),
  });
});

/* Abstract line doodles that fill the empty corner of each card */
const DOODLES: string[][] = [
  [
    "M70 170C20 152 22 122 72 120C122 118 92 82 42 86C22 87 26 62 50 54",
    "M36 60L50 54L56 68",
    "M112 92h52v46h-52z",
    "M122 114l14 12l34 -40",
  ],
  [
    "M60 110a8 8 0 1 1 8 8a16 16 0 1 1 -16 -16a26 26 0 1 1 26 26a36 36 0 1 1 -36 -36",
    "M160 70l7 20l20 7l-20 7l-7 20l-7 -20l-20 -7l20 -7z",
    "M185 140v22M174 151h22",
  ],
  [
    "M16 150l26 -34l26 34l26 -34l26 34l26 -34",
    "M196 150a20 20 0 1 0 -40 0a20 20 0 1 0 40 0",
    "M44 70v28M30 84h28",
    "M120 60q20 -26 40 0",
  ],
  [
    "M14 130q16 -22 32 0t32 0t32 0t32 0",
    "M14 156q16 -22 32 0t32 0t32 0t32 0",
    "M170 60l32 54h-64z",
    "M40 70a4 4 0 1 0 0.01 0",
  ],
];

/* ------------------------------------------------------------------ */
/* STYLES                                                              */
/* ------------------------------------------------------------------ */
const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Unbounded:wght@800;900&display=swap");

/* --mnav = height of your site navbar, so content starts below it. Adjust if needed. */
.mp{--mnav:clamp(4.5rem,10vh,6rem);position:relative;overflow-x:clip;background:#f3f5fa;color:#0b1020;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.msr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* ---- moving background ---- */
.mbg{position:sticky;top:0;height:100vh;height:100svh;margin-bottom:-100vh;margin-bottom:-100svh;overflow:hidden;z-index:0;pointer-events:none}
.mbg::before{content:"";position:absolute;inset:-28px;background-image:radial-gradient(rgba(15,25,60,.15) 1.4px,transparent 1.8px);background-size:28px 28px;animation:mgrid 6s linear infinite}
.mblob{position:absolute;width:42vmax;height:42vmax;border-radius:50%;filter:blur(70px);opacity:.55}
.mblob--b{background:#4285F4;left:-10vmax;top:-8vmax;animation:mdriftA 24s ease-in-out infinite alternate}
.mblob--r{background:#EA4335;right:-12vmax;top:6vmax;animation:mdriftB 29s ease-in-out infinite alternate}
.mblob--y{background:#FBBC04;left:8vmax;bottom:-18vmax;animation:mdriftC 26s ease-in-out infinite alternate}
.mblob--g{background:#34A853;right:-6vmax;bottom:-14vmax;animation:mdriftA 32s ease-in-out infinite alternate-reverse}
@keyframes mgrid{to{transform:translate(28px,28px)}}
@keyframes mdriftA{0%{transform:translate(0,0) scale(1)}100%{transform:translate(14vw,10vh) scale(1.2)}}
@keyframes mdriftB{0%{transform:translate(0,0) scale(1.1)}100%{transform:translate(-16vw,12vh) scale(.9)}}
@keyframes mdriftC{0%{transform:translate(0,0) scale(.95)}100%{transform:translate(18vw,-12vh) scale(1.2)}}

/* ---- one role per screen ---- */
.msec{position:relative;z-index:1;box-sizing:border-box;min-height:100vh;min-height:100svh;display:flex;flex-direction:column;align-items:center;padding:var(--mnav) 1.25rem 1.25rem;scroll-snap-align:start}
.mmain{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(1rem,3vh,2.2rem);padding:.5rem 0 1rem}
.mtitle{margin:0;text-align:center;font-family:"Unbounded",system-ui,sans-serif;font-weight:800;font-size:clamp(1.5rem,4.4vw,3.4rem);line-height:1.05;letter-spacing:-.01em;text-transform:uppercase;color:#0b1020}
.mdots{display:flex;gap:.5rem;margin-top:-.4rem}
.mdots i{width:.6rem;height:.6rem;border-radius:50%}
.mdots i:nth-child(1){background:#4285F4}.mdots i:nth-child(2){background:#EA4335}
.mdots i:nth-child(3){background:#FBBC04}.mdots i:nth-child(4){background:#34A853}

/* ---- cards ---- */
.mcards{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(1rem,2.4vw,2.2rem);width:100%}
.mslot{width:clamp(270px,min(30vw,62svh),460px)}
.mcards--few .mslot{width:clamp(280px,min(36vw,68svh),540px)}

/* 2 x 2 layout for roles with more than two people */
.mcards--grid{display:grid;grid-template-columns:repeat(2,minmax(0,var(--w)));justify-content:center;gap:clamp(.8rem,2vw,1.6rem);--w:clamp(240px,min(28vw,40svh),400px)}
.mcards--grid .mslot{width:auto}

.gcard{padding:.6rem;border-radius:34px;
  background:linear-gradient(145deg,rgba(255,255,255,.72),rgba(255,255,255,.28));
  border:1px solid rgba(255,255,255,.95);
  backdrop-filter:blur(22px) saturate(180%);-webkit-backdrop-filter:blur(22px) saturate(180%);
  box-shadow:0 34px 60px -30px var(--glow),0 2px 0 rgba(255,255,255,.95) inset,0 -1px 0 rgba(255,255,255,.5) inset;
  transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.gcard:hover{transform:translateY(-8px)}

/* dark at the top, lighter below */
.gcard__art{position:relative;aspect-ratio:5/4;overflow:hidden;container-type:inline-size;border-radius:26px;
  background:
    radial-gradient(80% 55% at 85% 100%,rgba(255,255,255,.3),transparent 70%),
    linear-gradient(180deg,var(--c2) 0%,var(--c1) 100%);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.4),inset 0 44px 60px -44px rgba(0,0,0,.3)}
.gcard__art::before{content:"";position:absolute;inset:50% 0 0 0;z-index:0;pointer-events:none;background:linear-gradient(to top,rgba(255,255,255,.22),rgba(255,255,255,0))}

.gcard__name{position:absolute;left:6%;top:8%;z-index:1;margin:0;max-width:66%;
  font-family:"Unbounded",system-ui,sans-serif;font-weight:800;
  font-size:1.1rem;font-size:calc(var(--fs,7) * 1cqw);line-height:1.1;letter-spacing:-.01em;
  text-transform:uppercase;white-space:pre-line;overflow-wrap:normal;word-break:keep-all;
  color:var(--tint);text-shadow:0 2px 0 rgba(0,0,0,.12)}
.gcard__quote{position:absolute;right:6%;top:1%;z-index:1;font-family:"Unbounded",system-ui,sans-serif;font-weight:900;
  font-size:3rem;font-size:15cqw;line-height:1;color:rgba(255,255,255,.92)}
.gcard__doodle{position:absolute;left:3%;bottom:4%;width:62%;z-index:1;fill:none;stroke:rgba(255,255,255,.95);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}

.gcard__photo{position:absolute;right:0;bottom:0;z-index:2;width:62%;height:86%;display:flex;align-items:flex-end;justify-content:flex-end}
.gcard__photo img{width:100%;height:100%;object-fit:contain;object-position:right bottom;transform-origin:bottom right;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.gcard:hover .gcard__photo img{transform:scale(1.04)}
.gcard__ph{width:80%;height:92%;fill:rgba(255,255,255,.4)}

.gcard__sheen{position:absolute;inset:0;z-index:4;pointer-events:none;transform:translateX(-130%);
  background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.5) 48%,transparent 62%);
  transition:transform 1s cubic-bezier(.2,.7,.2,1)}
.gcard:hover .gcard__sheen{transform:translateX(130%)}

/* ---- abstract shapes in the empty space ---- */
.mdecs{position:absolute;inset:0;z-index:0;pointer-events:none}
.msec--flip .mdecs{transform:scaleX(-1)}
.mdec{position:absolute;width:clamp(48px,7vw,110px);height:auto;fill:none;stroke-width:9;stroke-linecap:round;stroke-linejoin:round;opacity:.9;animation:mbob 7s ease-in-out infinite}
.mdec--ring{left:5%;top:22%;stroke:#4285F4;--r:0deg}
.mdec--plus{right:6%;top:20%;stroke:#EA4335;--r:10deg;animation-delay:-2s}
.mdec--tri{left:8%;bottom:18%;stroke:#34A853;--r:-12deg;animation-delay:-4s}
.mdec--sq{right:8%;bottom:22%;stroke:#FBBC04;--r:14deg;animation-delay:-1s}
.mdec--wave{left:24%;bottom:9%;width:clamp(70px,9vw,140px);stroke:#4285F4;--r:0deg;animation-delay:-3s}
.mdec--dots{right:22%;top:10%;width:clamp(44px,6vw,90px);fill:#EA4335;stroke:none;--r:0deg;animation-delay:-5s}
@keyframes mbob{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-16px) rotate(calc(var(--r,0deg) + 10deg))}}

/* ---- scroll hint ---- */
.mhint{display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:.4rem .8rem;border:0;background:none;cursor:pointer;color:#0b1020;font:inherit;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase}
.mhint:focus-visible{outline:2px solid #4285F4;outline-offset:3px;border-radius:8px}
.mhint svg{width:22px;height:38px;fill:none;stroke:#0b1020;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;animation:mhintbob 1.8s ease-in-out infinite}
.mhint--up svg{transform:rotate(180deg);animation:none}
@keyframes mhintbob{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}

/* ---- reveal when a role scrolls into view ---- */
.mtitle,.mdots,.mhint,.mslot{opacity:0;transition:opacity .7s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.mtitle{transform:translateY(26px)}
.mdots{transform:scale(.6)}
.mslot{transform:translateY(70px) scale(.94)}
.msec.is-in .mtitle,.msec.is-in .mdots,.msec.is-in .mhint,.msec.is-in .mslot{opacity:1;transform:none}
.msec.is-in .mtitle{transition-delay:.05s}
.msec.is-in .mdots{transition-delay:.15s}
.msec.is-in .mslot{transition-delay:calc(.2s + var(--i,0) * .12s)}
.msec.is-in .mhint{transition-delay:.8s}

@media (max-width:640px){
  .mcards--grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}
  .mcards--grid .gcard{padding:.35rem;border-radius:22px}
  .mcards--grid .gcard__art{border-radius:16px}
}
@media (max-width:760px){
  .mdec--wave,.mdec--dots,.mdec--sq{display:none}
  .mdec{opacity:.6}
}
@media (prefers-reduced-motion:reduce){
  .mbg::before,.mblob,.mdec,.mhint svg{animation:none}
  .mtitle,.mdots,.mhint,.mslot{opacity:1;transform:none;transition:none}
  .gcard,.gcard__photo img,.gcard__sheen{transition:none}
}
`;

/* ------------------------------------------------------------------ */
/* PIECES                                                              */
/* ------------------------------------------------------------------ */
function Decor() {
  return (
    <div class="mdecs" aria-hidden="true">
      <svg class="mdec mdec--ring" viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" /></svg>
      <svg class="mdec mdec--plus" viewBox="0 0 80 80"><path d="M40 10v60M10 40h60" /></svg>
      <svg class="mdec mdec--tri" viewBox="0 0 80 80"><path d="M40 10L72 68H8z" /></svg>
      <svg class="mdec mdec--sq" viewBox="0 0 80 80"><rect x="12" y="12" width="56" height="56" rx="12" /></svg>
      <svg class="mdec mdec--wave" viewBox="0 0 100 40"><path d="M5 22q12 -22 24 0t24 0t24 0t24 0" /></svg>
      <svg class="mdec mdec--dots" viewBox="0 0 60 60">
        <circle cx="10" cy="10" r="5" /><circle cx="30" cy="10" r="5" /><circle cx="50" cy="10" r="5" />
        <circle cx="10" cy="30" r="5" /><circle cx="30" cy="30" r="5" /><circle cx="50" cy="30" r="5" />
        <circle cx="10" cy="50" r="5" /><circle cx="30" cy="50" r="5" /><circle cx="50" cy="50" r="5" />
      </svg>
    </div>
  );
}

function Silhouette() {
  return (
    <svg class="gcard__ph" viewBox="0 0 200 240" aria-hidden="true">
      <circle cx="100" cy="88" r="46" />
      <path d="M12 240c0-56 38-92 88-92s88 36 88 92z" />
    </svg>
  );
}

function GlassCard(props: { m: Member; role: string }) {
  const [failed, setFailed] = createSignal(false);

  return (
    <article class="gcard" aria-label={`${props.m.name}, ${props.role}`}>
      <div class="gcard__art">
        <p class="gcard__name" style={{ "--fs": String(props.m.fs) }}>
          {props.m.name.split(" ").join("\n")}
        </p>
        <span class="gcard__quote" aria-hidden="true">”</span>

        <svg class="gcard__doodle" viewBox="0 0 220 180" aria-hidden="true">
          <For each={DOODLES[props.m.doodle]}>{(d) => <path d={d} />}</For>
        </svg>

        <div class="gcard__photo">
          <Show when={props.m.photo && !failed()} fallback={<Silhouette />}>
            <img
              src={props.m.photo}
              alt={props.m.name}
              loading="lazy"
              onError={() => setFailed(true)}
            />
          </Show>
        </div>

        <span class="gcard__sheen" aria-hidden="true" />
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function Members() {
  const solved = checkSolved();
  const sections: HTMLElement[] = [];
  let observer: IntersectionObserver | undefined;
  let prevSnap = "";

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.target.classList.toggle("is-in", e.isIntersecting));
      },
      { threshold: 0.3 },
    );
    sections.forEach((s) => observer && observer.observe(s));

    const root = document.documentElement;
    prevSnap = root.style.scrollSnapType;
    root.style.scrollSnapType = "y proximity";
  });

  onCleanup(() => {
    if (observer) observer.disconnect();
    document.documentElement.style.scrollSnapType = prevSnap;
  });

  const go = (i: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = i >= ROLES.length - 1 ? sections[0] : sections[i + 1];
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div class="mp">
      <style>{CSS}</style>
      <h1 class="msr">Meet our members</h1>

      <Show when={solved}>
        <div class="toast" role="status">🎉 You found and fixed the routing bug! Flag: <b>{FLAG}</b></div>
      </Show>

      <div class="mbg" aria-hidden="true">
        <i class="mblob mblob--b" />
        <i class="mblob mblob--r" />
        <i class="mblob mblob--y" />
        <i class="mblob mblob--g" />
      </div>

      <For each={ROLES}>
        {(role, i) => {
          const last = () => i() === ROLES.length - 1;
          return (
            <section
              class="msec"
              classList={{ "msec--flip": i() % 2 === 1 }}
              ref={(el) => {
                sections[i()] = el;
              }}
              style={{
                "--c1": role.theme.c1,
                "--c2": role.theme.c2,
                "--tint": role.theme.tint,
                "--glow": role.theme.glow,
              }}
              aria-label={role.title}
            >
              <Decor />

              <div class="mmain">
                <h2 class="mtitle">{role.title}</h2>
                <div class="mdots" aria-hidden="true"><i /><i /><i /><i /></div>

                <div
                  class="mcards"
                  classList={{
                    "mcards--few": role.members.length <= 2,
                    "mcards--grid": role.members.length > 2,
                  }}
                >
                  <For each={role.members}>
                    {(m, n) => (
                      <div class="mslot" style={{ "--i": n() }}>
                        <GlassCard m={m} role={role.title} />
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <button
                type="button"
                class="mhint"
                classList={{ "mhint--up": last() }}
                onClick={() => go(i())}
                aria-label={last() ? "Back to the first role" : "Scroll to the next role"}
              >
                <span>{last() ? "Back to top" : "Scroll down"}</span>
                <svg viewBox="0 0 24 40" aria-hidden="true">
                  <path d="M12 2v34M3 27l9 10l9 -10" />
                </svg>
              </button>
            </section>
          );
        }}
      </For>
    </div>
  );
}