import { onCleanup } from "solid-js";

export function reveal(el: HTMLElement) {
  el.classList.add("fade");
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("fade--in");
        io.disconnect();
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  io.observe(el);
  onCleanup(() => io.disconnect());
}
