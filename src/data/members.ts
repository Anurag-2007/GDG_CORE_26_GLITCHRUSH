export type Member = {
  name: string;
  role: string;
  group: "Leads" | "Organisers" | "Core Members";
  image?: string;
};

export const MEMBERS: Member[] = [
  { name: "Anurag Pandit", role: "GDG Organiser", group: "Organisers" },
  { name: "Adrisha Biswas", role: "GDG Organiser", group: "Organisers" },
  { name: "Karan", role: "Management Lead", group: "Leads" },
  { name: "Prashant Raj", role: "Management Lead", group: "Leads" },
  { name: "Joyjit Deb", role: "Creative Lead", group: "Leads" },
  { name: "Arkashma Seal", role: "Creative Lead", group: "Leads" },
  { name: "Ayonava Ghosh", role: "Web Dev Lead", group: "Leads" },
  { name: "Debabrata Mandal", role: "App Dev Lead", group: "Leads" },
  { name: "Anshumaan Sharma", role: "App Dev Lead", group: "Leads" },
  { name: "Ayush Lahiri", role: "AI&ML Lead", group: "Leads" },
  { name: "Rishav Sarkar", role: "AI&ML Lead", group: "Leads" },
  { name: "Subhra Sekhar Garai", role: "Blockchain Lead", group: "Leads" },
  { name: "Harsh Raj", role: "Public Relations Lead", group: "Leads" },
  { name: "Soma Das", role: "Public Relations Lead", group: "Leads" },
  { name: "Agnik Das", role: "Media and Outreach Lead", group: "Leads" },
  { name: "Saina Pal", role: "Media and Outreach Lead", group: "Leads" },
  { name: "Anusha Muhuri", role: "Women in Tech Lead", group: "Leads" },
  { name: "Alka Verma", role: "Women in Tech Lead", group: "Leads" },
  { name: "Anuskaa Ghosh", role: "Extended Core Member", group: "Core Members" },
  { name: "Abhya Kumari", role: "Extended Core Member", group: "Core Members" },
  { name: "Anshu Ranjan", role: "Extended Core Member", group: "Core Members" },
  { name: "Koshik Ray", role: "Extended Core Member", group: "Core Members" },
];

export const GROUPS = ["Organisers", "Leads", "Core Members"] as const;

const files = import.meta.glob<string>("./images/photos/*.{png,jpg,jpeg,webp,avif,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const stripExt = (s: string) => s.replace(/\.[^.]+$/, "");

const byName: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  byName[slug(stripExt(path.split("/").pop()!))] = url;
}

export function imageFor(m: Member): string | undefined {
  if (m.image) return byName[slug(stripExt(m.image))]; 
  return byName[slug(`${m.name} ${m.role}`)] ?? byName[slug(m.name)]; 
}
