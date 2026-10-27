export const BROKEN_PATH = "/member"; 
export const FLAG = "GDG{one_missing_s}"; 

const KEY = "gdg-puzzle-404";
const HINTS = [
  "Click “Meet the members” and look at the address bar. Where did it take you?",
  "That page doesn't exist. Compare the URL with the real page in the navbar button name. What's different?",
  "Right-click the button → Inspect. Find its href attribute in the Elements tab.",
  "The console can change the page. Try: document.querySelectorAll('a')",
  "Loop over the links and fix any whose href is '/member': set it to '/members'. Then click the button again.",
];
let used = 0;

const store = {
  set: () => { try { sessionStorage.setItem(KEY, "1"); } catch {} },
  take: () => {
    try {
      const had = sessionStorage.getItem(KEY) === "1";
      sessionStorage.removeItem(KEY);
      return had;
    } catch { return false; }
  },
};

export function installPuzzle() {
  (window as unknown as { hint: () => string }).hint = () => {
    const text = HINTS[Math.min(used, HINTS.length - 1)];
    used = Math.min(used + 1, HINTS.length);
    console.log(`%c💡 Hint ${used}/${HINTS.length}%c ${text}`, "background:#fbbc04;color:#202124;padding:2px 8px;border-radius:4px;font-weight:700", "");
    return used >= HINTS.length ? "That was the last hint." : "Type hint() again for another.";
  };

  console.log("%cGDG On Campus", "font-size:20px;font-weight:700;color:#4285f4");
  console.log("Something on this site is broken. Can you find it and fix it from this console?\nType %chint()%c if you get stuck.", "font-weight:700;color:#ea4335", "");
}

export function noteBrokenLink(path: string) {
  store.set();
  console.warn(`%c404%c  “${path}” doesn't exist. Look closely at where you came from. Type hint() for help.`, "background:#ea4335;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700", "");
}

export function checkSolved(): boolean {
  if (!store.take()) return false;
  console.log(`%c🎉 Fixed!%c You found the routing bug. Flag: ${FLAG}`, "background:#34a853;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700", "font-weight:700");
  return true;
}
