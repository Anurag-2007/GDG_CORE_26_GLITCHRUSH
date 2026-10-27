
export const BROKEN_PATH = "/member";
export const FLAG = "GDG{one_missing_s}";

const KEY = "gdg-puzzle-404";

const HINTS = [
  "🕵️ Clue 01: A button led you to a dead end. Retrace your steps, detective. What does the address bar reveal?",
  "🔎 Clue 02: The page may be missing, but its name isn't a mystery. Compare the destination with the name of the page you're looking for.",
  "🗂️ Clue 03: Every button leaves a trail. Inspect “View Members” and investigate its href. The smallest detail might crack this case.",
];

let used = 0;

const store = {
  set: () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  },

  take: () => {
    try {
      const had = sessionStorage.getItem(KEY) === "1";
      sessionStorage.removeItem(KEY);
      return had;
    } catch {
      return false;
    }
  },
};

export function installPuzzle() {
  (window as unknown as { hint: () => string }).hint = () => {
    const text = HINTS[Math.min(used, HINTS.length - 1)];
    used = Math.min(used + 1, HINTS.length);

    console.log(
      `%c💡 Hint ${used}/${HINTS.length}%c ${text}`,
      "background:#fbbc04;color:#202124;padding:2px 8px;border-radius:4px;font-weight:700",
      ""
    );

    return used >= HINTS.length
      ? "That's the last hint. You've got this!"
      : "Type hint() again for another hint.";
  };

  console.log(
    "%cGDG On Campus",
    "font-size:20px;font-weight:700;color:#4285f4"
  );

  console.log(
    "Something on this site is broken. Can you figure out what went wrong?\nType %chint()%c if you need a little help.",
    "font-weight:700;color:#ea4335",
    ""
  );
}

export function noteBrokenLink(path: string) {
  store.set();

  console.warn(
    `%c404%c “${path}” doesn't exist. Maybe the answer is hiding in plain sight. Type hint() for help.`,
    "background:#ea4335;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700",
    ""
  );
}

export function checkSolved(): boolean {
  if (!store.take()) return false;

  console.log(
    `%c🎉 Fixed!%c You found the routing bug. Flag: ${FLAG}`,
    "background:#34a853;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700",
    "font-weight:700"
  );

  return true;
}
