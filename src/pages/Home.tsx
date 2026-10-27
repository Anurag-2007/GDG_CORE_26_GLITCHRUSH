import { A } from "@solidjs/router";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { BROKEN_PATH } from "../puzzle";

/* Put the video at  public/gdganima.mp4   */
const VIDEO_SRC = "/gdganima.mp4";

const FEATURES = [
  { c: "blue", title: "Learn", text: "Workshops and study jams on web, Android, cloud and AI." },
  { c: "red", title: "Build", text: "Team projects and hack nights where ideas become working apps." },
  { c: "yellow", title: "Connect", text: "Meet developers, mentors and speakers from the Google ecosystem." },
  { c: "green", title: "Grow", text: "Prepare for internships and careers with real-world experience." },
];

/* 24x24 line icons, one per feature */
const ICONS: Record<string, string[]> = {
  blue: ["M3 6.5C5 5 8 4.8 12 7c4-2.2 7-2 9-.5V19c-2-1.5-5-1.7-9 .5-4-2.2-7-2-9-.5z", "M12 7v12.5"],
  red: ["M8 8l-5 4 5 4", "M16 8l5 4-5 4", "M14 5l-4 14"],
  yellow: [
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    "M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6",
    "M16 4.3a3.5 3.5 0 0 1 0 6.4",
    "M18 14.3c2 .8 3.5 2.6 3.5 5.7",
  ],
  green: ["M3 17l6-6 4 4 8-8", "M15 7h6v6"],
};

const TICKER = ["Learn", "Build", "Connect", "Grow"];
const TICKER_COLORS = ["b", "r", "y", "g"];

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800;900&display=swap");

.hm{--mnav:clamp(4.5rem,10vh,6rem);--blue:#4285F4;--red:#EA4335;--yellow:#FBBC04;--green:#34A853;--ink:#0b1020;
  position:relative;isolation:isolate;overflow-x:clip;background:#f3f5fa;color:var(--ink);
  font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.hm *{box-sizing:border-box}
.hm-wrap{width:min(1180px,100% - 2.5rem);margin-inline:auto}

/* ---------- moving background ---------- */
.hm-bg{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
.hm-bg::before{content:"";position:absolute;inset:-28px;background-image:radial-gradient(rgba(15,25,60,.14) 1.4px,transparent 1.8px);background-size:28px 28px;animation:hm-grid 6s linear infinite}
.hm-blob{position:absolute;width:40vmax;height:40vmax;border-radius:50%;filter:blur(70px);opacity:.5}
.hm-blob--b{background:var(--blue);left:-12vmax;top:-6vmax;animation:hm-dA 24s ease-in-out infinite alternate}
.hm-blob--r{background:var(--red);right:-14vmax;top:14vmax;animation:hm-dB 29s ease-in-out infinite alternate}
.hm-blob--y{background:var(--yellow);left:6vmax;top:62vmax;animation:hm-dC 26s ease-in-out infinite alternate}
.hm-blob--g{background:var(--green);right:-8vmax;top:96vmax;animation:hm-dA 32s ease-in-out infinite alternate-reverse}
@keyframes hm-grid{to{transform:translate(28px,28px)}}
@keyframes hm-dA{0%{transform:translate(0,0) scale(1)}100%{transform:translate(12vw,9vh) scale(1.2)}}
@keyframes hm-dB{0%{transform:translate(0,0) scale(1.1)}100%{transform:translate(-14vw,10vh) scale(.9)}}
@keyframes hm-dC{0%{transform:translate(0,0) scale(.95)}100%{transform:translate(16vw,-10vh) scale(1.2)}}

/* ---------- reveal ---------- */
[data-rv]{opacity:0;transform:translateY(34px);transition:opacity .8s ease,transform .9s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0s)}
[data-rv].is-in{opacity:1;transform:none}

/* ---------- hero ---------- */
.hm-hero{display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:clamp(1.5rem,4vw,4rem);
  min-height:100vh;min-height:100svh;padding:calc(var(--mnav) + .5rem) 0 3rem}
.hm-pill{display:inline-flex;align-items:center;gap:.65rem;padding:.5rem 1rem .5rem .8rem;border-radius:999px;font-size:.85rem;font-weight:600;
  background:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.95);box-shadow:0 10px 24px -14px rgba(20,30,80,.35);
  backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%)}
.hm-pill__dots{display:flex;gap:3px}
.hm-pill__dots i{width:.5rem;height:.5rem;border-radius:50%}
.hm-pill__dots i:nth-child(1){background:var(--blue)}.hm-pill__dots i:nth-child(2){background:var(--red)}
.hm-pill__dots i:nth-child(3){background:var(--yellow)}.hm-pill__dots i:nth-child(4){background:var(--green)}

.hm-h1{margin:1.3rem 0 1.2rem;font-family:"Unbounded",system-ui,sans-serif;font-weight:800;font-size:clamp(2.2rem,5.4vw,4.6rem);line-height:1.04;letter-spacing:-.02em}
.hm-h1 .grad{display:block;background:linear-gradient(90deg,var(--blue),var(--red),var(--yellow),var(--green),var(--blue));background-size:300% 100%;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:hm-shift 7s linear infinite}
@keyframes hm-shift{to{background-position:-300% 0}}
.hm-lead{margin:0;max-width:34rem;font-size:clamp(1rem,1.5vw,1.2rem);line-height:1.65;color:#3b4258;
  padding-left:1rem;border-left:4px solid var(--blue);border-image:linear-gradient(to bottom,var(--blue),var(--red),var(--yellow),var(--green)) 1}
.hm-cta{display:flex;flex-wrap:wrap;gap:.9rem}

.hm-btn{display:inline-flex;align-items:center;justify-content:center;padding:.9rem 1.7rem;border-radius:16px;font-weight:700;font-size:1rem;text-decoration:none;cursor:pointer;
  color:#fff;background:#1a73e8;border:2px solid #1a73e8;box-shadow:5px 5px 0 var(--ink);transition:transform .2s,box-shadow .2s}
.hm-btn:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--ink)}
.hm-btn:active{transform:translate(3px,3px);box-shadow:2px 2px 0 var(--ink)}
.hm-btn--ghost{color:var(--ink);background:rgba(255,255,255,.7);border-color:var(--ink);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.hm-btn:focus-visible{outline:3px solid var(--yellow);outline-offset:3px}

/* ---------- hero stage (video) ---------- */
.hm-stage{position:relative;display:grid;place-items:center;padding:clamp(1.2rem,3vw,2.5rem)}
.hm-orbit{position:absolute;inset:2%;border-radius:50%;border:2px dashed rgba(15,25,60,.22);animation:hm-spin 40s linear infinite}
.hm-orbit--2{inset:12%;border-color:rgba(66,133,244,.45);animation-duration:28s;animation-direction:reverse}
@keyframes hm-spin{to{transform:rotate(360deg)}}

.hm-frame{position:relative;width:100%;padding:.7rem;border-radius:32px;
  background:linear-gradient(145deg,rgba(255,255,255,.85),rgba(255,255,255,.35));border:1px solid rgba(255,255,255,.95);
  backdrop-filter:blur(22px) saturate(180%);-webkit-backdrop-filter:blur(22px) saturate(180%);
  box-shadow:0 40px 70px -34px rgba(66,133,244,.6),0 2px 0 rgba(255,255,255,.95) inset;animation:hm-float 8s ease-in-out infinite}
@keyframes hm-float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-14px) rotate(1deg)}}
.hm-bar{display:flex;align-items:center;gap:.4rem;padding:.2rem .6rem .6rem}
.hm-bar i{width:.7rem;height:.7rem;border-radius:50%}
.hm-bar i:nth-child(1){background:var(--red)}.hm-bar i:nth-child(2){background:var(--yellow)}.hm-bar i:nth-child(3){background:var(--green)}
.hm-bar b{flex:1;height:.7rem;margin-left:.6rem;border-radius:99px;background:rgba(15,25,60,.08)}
.hm-screen{position:relative;aspect-ratio:854/470;overflow:hidden;border-radius:22px;background:#fff;box-shadow:inset 0 0 0 1px rgba(15,25,60,.08)}
.hm-screen video,.hm-screen__fb{position:absolute;inset:0;width:100%;height:100%}
.hm-screen video{object-fit:cover;transform:scale(1.08);pointer-events:none}
.hm-screen__fb{display:grid;place-items:center}
.hm-screen__fb svg{width:46%;height:auto}
.hm-screen__fb path{fill:none;stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.hm-corner{position:absolute;width:1.6rem;height:1.6rem;border:4px solid;pointer-events:none;z-index:2}
.hm-corner--tl{left:.7rem;top:.7rem;border-color:var(--blue) transparent transparent var(--blue);border-top-left-radius:10px}
.hm-corner--tr{right:.7rem;top:.7rem;border-color:var(--red) var(--red) transparent transparent;border-top-right-radius:10px}
.hm-corner--bl{left:.7rem;bottom:.7rem;border-color:transparent transparent var(--yellow) var(--yellow);border-bottom-left-radius:10px}
.hm-corner--br{right:.7rem;bottom:.7rem;border-color:transparent var(--green) var(--green) transparent;border-bottom-right-radius:10px}

.hm-chip{position:absolute;z-index:3;display:grid;place-items:center;min-width:3.4rem;height:3.4rem;padding:0 .8rem;border-radius:18px;
  font-family:"Unbounded",system-ui,sans-serif;font-weight:800;font-size:1.05rem;
  background:rgba(255,255,255,.85);border:1px solid #fff;box-shadow:0 18px 30px -14px rgba(15,25,60,.45);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:hm-bob 6s ease-in-out infinite}
.hm-chip--b{left:0;top:6%;color:var(--blue);--r:-8deg}
.hm-chip--r{right:0;top:12%;color:var(--red);--r:9deg;animation-delay:-2s}
.hm-chip--y{left:3%;bottom:6%;color:#d99a00;--r:7deg;animation-delay:-4s}
.hm-chip--g{right:3%;bottom:3%;color:var(--green);--r:-10deg;animation-delay:-1s}
@keyframes hm-bob{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-14px) rotate(calc(var(--r,0deg) + 8deg))}}

/* ---------- ticker ---------- */
.hm-ticker{position:relative;overflow:hidden;padding:1rem 0;background:var(--ink);transform:rotate(-1.2deg);margin:0 -2%;box-shadow:0 20px 40px -24px rgba(11,16,32,.7)}
.hm-ticker__track{display:flex;width:max-content;animation:hm-marq 26s linear infinite}
.hm-ticker__group{display:flex;align-items:center;gap:2rem;padding-right:2rem}
.hm-ticker span{font-family:"Unbounded",system-ui,sans-serif;font-weight:800;font-size:clamp(1.1rem,2.4vw,1.7rem);text-transform:uppercase;letter-spacing:.02em;white-space:nowrap}
.hm-ticker .b{color:#8ab4f8}.hm-ticker .r{color:#f28b82}.hm-ticker .y{color:#fdd663}.hm-ticker .g{color:#81c995}
.hm-ticker em{font-style:normal;color:rgba(255,255,255,.35);font-family:"Unbounded",system-ui,sans-serif;font-weight:800}
@keyframes hm-marq{to{transform:translateX(-50%)}}

/* ---------- sections ---------- */
.hm-section{padding:clamp(4rem,9vw,7rem) 0 1rem;scroll-margin-top:calc(var(--mnav) - 1rem)}
.hm-h2{margin:0 0 2.2rem;display:flex;flex-wrap:wrap;align-items:center;gap:.7rem;font-family:"Unbounded",system-ui,sans-serif;font-weight:800;font-size:clamp(1.7rem,3.8vw,3rem);letter-spacing:-.01em}
.hm-h2 .br{color:var(--blue)}.hm-h2 .br:last-child{color:var(--red)}

.hm-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.2rem}
.hm-card{--a:var(--blue);--ink2:#fff;position:relative;display:flex;flex-direction:column;gap:.8rem;overflow:hidden;min-height:20rem;padding:1.5rem;border-radius:28px;
  background:linear-gradient(150deg,rgba(255,255,255,.85),rgba(255,255,255,.4));border:1px solid rgba(255,255,255,.95);
  backdrop-filter:blur(18px) saturate(170%);-webkit-backdrop-filter:blur(18px) saturate(170%);
  box-shadow:0 26px 44px -30px var(--a),0 2px 0 rgba(255,255,255,.95) inset;transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s}
.hm-card.c-red{--a:var(--red)}.hm-card.c-yellow{--a:var(--yellow);--ink2:#3b2a00}.hm-card.c-green{--a:var(--green)}
.hm-card::before{content:"";position:absolute;left:0;right:0;top:0;height:7px;background:var(--a)}
.hm-card::after{content:"";position:absolute;right:-2.2rem;bottom:-2.2rem;width:9rem;height:9rem;border-radius:50%;background:var(--a);opacity:.14;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.hm-card:hover{transform:translateY(-10px);box-shadow:0 36px 50px -28px var(--a),0 2px 0 rgba(255,255,255,.95) inset}
.hm-card:hover::after{transform:scale(1.6)}
.hm-card__icon{display:grid;place-items:center;width:3.8rem;height:3.8rem;border-radius:18px;background:var(--a);color:var(--ink2);
  box-shadow:0 14px 22px -12px var(--a);transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.hm-card:hover .hm-card__icon{transform:rotate(-8deg) scale(1.08)}
.hm-card__icon svg{width:1.9rem;height:1.9rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hm-card h3{margin:auto 0 0;font-family:"Unbounded",system-ui,sans-serif;font-weight:800;font-size:1.7rem;letter-spacing:-.01em;position:relative;z-index:1}
.hm-card p{margin:0;font-size:1rem;line-height:1.6;color:#3b4258;position:relative;z-index:1}

/* ---------- join band ---------- */
.hm-bandwrap{padding:clamp(3rem,7vw,5.5rem) 0 clamp(4rem,8vw,6rem)}
.hm-band{position:relative;overflow:hidden;isolation:isolate;padding:clamp(2rem,5vw,4rem);border-radius:36px;color:#fff;background:#0e1330;
  box-shadow:0 40px 70px -36px rgba(14,19,48,.9)}
.hm-band::before{content:"";position:absolute;inset:0;z-index:-2;
  background:radial-gradient(40rem 22rem at 0% 0%,rgba(66,133,244,.55),transparent 65%),radial-gradient(34rem 20rem at 100% 100%,rgba(52,168,83,.5),transparent 65%),radial-gradient(26rem 16rem at 80% 0%,rgba(234,67,53,.4),transparent 65%)}
.hm-band::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;border:2px solid transparent;
  background:linear-gradient(90deg,var(--blue),var(--red),var(--yellow),var(--green),var(--blue)) border-box;background-size:300% 100%;
  -webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0);
  animation:hm-shift 8s linear infinite}
.hm-band__text{position:relative;z-index:2;max-width:32rem}
.hm-band h2{margin:0 0 .8rem;font-family:"Unbounded",system-ui,sans-serif;font-weight:800;font-size:clamp(1.8rem,4.2vw,3.2rem);line-height:1.08}
.hm-band p{margin:0 0 1.8rem;font-size:1.1rem;line-height:1.6;color:rgba(255,255,255,.82)}
.hm-band .hm-btn{color:var(--ink);background:#fff;border-color:#fff;box-shadow:5px 5px 0 var(--yellow)}
.hm-band .hm-btn:hover{box-shadow:8px 8px 0 var(--yellow)}
.hm-band .hm-btn:active{box-shadow:2px 2px 0 var(--yellow)}

.hm-caps{position:absolute;inset:0;z-index:1;pointer-events:none}
.hm-cap{position:absolute;width:clamp(120px,20vw,260px);height:clamp(36px,5.6vw,72px);border-radius:99px;animation:hm-capbob 7s ease-in-out infinite}
.hm-cap--b{right:22%;top:18%;background:var(--blue);--r:-32deg}
.hm-cap--r{right:6%;top:10%;background:var(--red);--r:-32deg;animation-delay:-2s}
.hm-cap--g{right:3%;bottom:20%;background:var(--green);--r:32deg;animation-delay:-4s}
.hm-cap--y{right:20%;bottom:8%;background:var(--yellow);--r:32deg;animation-delay:-1s}
@keyframes hm-capbob{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-16px) rotate(var(--r,0deg))}}

/* ---------- responsive ---------- */
@media (max-width:1020px){
  .hm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hm-card{min-height:16rem}
}
@media (max-width:900px){
  .hm-hero{grid-template-columns:1fr;min-height:0;padding-bottom:2rem}
  .hm-stage{max-width:560px;margin-inline:auto;width:100%}
  .hm-cap{opacity:.28}
}
@media (max-width:560px){
  .hm-grid{grid-template-columns:1fr}
  .hm-card{min-height:0}
  .hm-card h3{margin-top:.6rem}
  .hm-chip{transform:scale(.8)}
}
@media (prefers-reduced-motion:reduce){
  .hm *,.hm *::before,.hm *::after{animation:none!important;transition:none!important}
  [data-rv]{opacity:1;transform:none}
}
`;

function FallbackLogo() {
  return (
    <div class="hm-screen__fb">
      <svg viewBox="0 0 64 48" aria-hidden="true">
        <path d="M26 6L8 24" stroke="#EA4335" />
        <path d="M8 24L26 42" stroke="#4285F4" />
        <path d="M38 6L56 24" stroke="#34A853" />
        <path d="M56 24L38 42" stroke="#FBBC04" />
      </svg>
    </div>
  );
}

export default function Home() {
  let root: HTMLDivElement | undefined;
  let vid: HTMLVideoElement | undefined;
  let observer: IntersectionObserver | undefined;
  let timer: number | undefined;
  const [videoFailed, setVideoFailed] = createSignal(false);

  const replayLater = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!vid) return;
      vid.currentTime = 0;
      vid.play().catch(() => undefined);
    }, 1600); // hold the finished logo for a moment, then play again
  };

  onMount(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (root) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              observer && observer.unobserve(e.target);
            }
          }),
        { threshold: 0.15 },
      );
      root.querySelectorAll("[data-rv]").forEach((el) => observer && observer.observe(el));
    }

    if (vid) {
      vid.muted = true;
      if (reduce) {
        // show the finished logo, no motion
        const freeze = () => {
          if (vid) {
            vid.pause();
            vid.currentTime = Math.max(0, (vid.duration || 3) - 0.05);
          }
        };
        if (vid.readyState >= 1) freeze();
        else vid.addEventListener("loadedmetadata", freeze, { once: true });
      } else {
        vid.play().catch(() => undefined);
      }
    }
  });

  onCleanup(() => {
    if (observer) observer.disconnect();
    window.clearTimeout(timer);
  });

  return (
    <div class="hm" ref={root}>
      <style>{CSS}</style>

      <div class="hm-bg" aria-hidden="true">
        <i class="hm-blob hm-blob--b" />
        <i class="hm-blob hm-blob--r" />
        <i class="hm-blob hm-blob--y" />
        <i class="hm-blob hm-blob--g" />
      </div>

      <section class="hm-hero hm-wrap">
        <div>
          <span class="hm-pill" data-rv>
            <span class="hm-pill__dots" aria-hidden="true"><i /><i /><i /><i /></span>
            Google Developer Groups · On Campus
          </span>
          <h1 class="hm-h1" data-rv style={{ "--d": ".1s" }}>
            Learn. Build. <span class="grad">Grow together.</span>
          </h1>
          <p class="hm-lead" data-rv style={{ "--d": ".2s" }}>
            A student community for anyone curious about technology. No experience needed, just
            bring your curiosity.
          </p>
        </div>

        <div class="hm-stage" data-rv style={{ "--d": ".25s" }} aria-hidden="true">
          <div class="hm-orbit" />
          <div class="hm-orbit hm-orbit--2" />
          <span class="hm-chip hm-chip--b">&lt;/&gt;</span>
          <span class="hm-chip hm-chip--r">{"{ }"}</span>
          <span class="hm-chip hm-chip--y">{"[ ]"}</span>
          <span class="hm-chip hm-chip--g">{"( )"}</span>

          <div class="hm-frame">
            <div class="hm-screen">
              <Show when={!videoFailed()} fallback={<FallbackLogo />}>
                <video
                  ref={vid}
                  src={VIDEO_SRC}
                  muted
                  autoplay
                  playsinline
                  preload="auto"
                  onEnded={replayLater}
                  onError={() => setVideoFailed(true)}
                />
              </Show>
            </div>
          </div>
        </div>
      </section>

      <div class="hm-ticker" aria-hidden="true">
        <div class="hm-ticker__track">
          <For each={[0, 1]}>
            {() => (
              <div class="hm-ticker__group">
                <For each={[...TICKER, ...TICKER]}>
                  {(t, i) => (
                    <>
                      <span class={TICKER_COLORS[i() % 4]}>{t}</span>
                      <em>&lt;/&gt;</em>
                    </>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>

      <section id="what-we-do" class="hm-section hm-wrap">
        <h2 class="hm-h2" data-rv>
          <span class="br" aria-hidden="true">&lt;</span>
          What we do
          <span class="br" aria-hidden="true">/&gt;</span>
        </h2>
        <div class="hm-grid">
          <For each={FEATURES}>
            {(f, i) => (
              <article class={`hm-card c-${f.c}`} data-rv style={{ "--d": `${i() * 0.12}s` }}>
                <span class="hm-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <For each={ICONS[f.c]}>{(d) => <path d={d} />}</For>
                  </svg>
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            )}
          </For>
        </div>
      </section>

      <section class="hm-bandwrap hm-wrap">
        <div class="hm-band" data-rv>
          <div class="hm-caps" aria-hidden="true">
            <i class="hm-cap hm-cap--b" />
            <i class="hm-cap hm-cap--r" />
            <i class="hm-cap hm-cap--g" />
            <i class="hm-cap hm-cap--y" />
          </div>
          <div class="hm-band__text">
            <h2>Ready to join?</h2>
            <p>See who is behind the community and say hello.</p>
            <A href={BROKEN_PATH} class="hm-btn">View members</A>
          </div>
        </div>
      </section>
    </div>
  );
}