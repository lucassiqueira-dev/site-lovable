export const TOTAL_POINTS = 20;

export const ATTRIBUTES = [
  { key: "logica", label: "Lógica", icon: "🧠" },
  { key: "criatividade", label: "Criatividade", icon: "🎨" },
  { key: "cafe", label: "Café", icon: "☕" },
  { key: "debugging", label: "Debugging", icon: "🐛" },
  { key: "foco", label: "Foco", icon: "🎯" },
] as const;

export type AttrKey = (typeof ATTRIBUTES)[number]["key"];
export type Attrs = Record<AttrKey, number>;

export const CLASSES = [
  {
    id: "backend",
    name: "Mago do Backend",
    icon: "🧙",
    tagline: "Conjura queries e invoca microserviços das profundezas.",
  },
  {
    id: "frontend",
    name: "Guerreiro Frontend",
    icon: "🛡️",
    tagline: "Enfrenta o caos do CSS com escudo de flexbox.",
  },
  {
    id: "hacker",
    name: "Hacker Cyberpunk",
    icon: "👾",
    tagline: "Atravessa firewalls como quem atravessa a rua.",
  },
  {
    id: "devops",
    name: "Ninja do DevOps",
    icon: "🥷",
    tagline: "Faz deploy na sexta-feira e some na neblina.",
  },
] as const;

export type ClassId = (typeof CLASSES)[number]["id"];

export const emptyAttrs: Attrs = {
  logica: 0,
  criatividade: 0,
  cafe: 0,
  debugging: 0,
  foco: 0,
};

export type Character = {
  name: string;
  nickname: string;
  bio: string;
  classId: ClassId;
  attrs: Attrs;
  items: string[];
};

const NAMES = ["Ada Byte", "Linus Vortex", "Grace Nullpointer", "Kaio Segfault", "Nina Kernel", "Rafa Async"];
const NICKS = ["null_pointer", "seg.fault", "ctrl_alt_elite", "dark_mode", "404_soul", "async_awaited"];
const BIOS = [
  "Sobrevive de café e stack traces desde 2013.",
  "Já derrubou a produção duas vezes. E aprendeu com uma.",
  "Escreve testes só quando o medo aperta.",
  "Fala fluentemente em regex e sarcasmo.",
  "Resolve bugs dormindo, cria três acordado.",
];
const ITEMS = [
  "Espada de React",
  "Escudo de TypeScript",
  "Poção de Python",
  "Elmo de Docker",
  "Adaga de Rust",
  "Cajado de GraphQL",
  "Botas de Tailwind",
  "Anel de Redis",
  "Manto de Linux",
  "Amuleto de Git",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function randomCharacter(): Character {
  const attrs = { ...emptyAttrs };
  const keys = ATTRIBUTES.map((a) => a.key);
  for (let i = 0; i < TOTAL_POINTS; i++) {
    const k = pick(keys);
    if (attrs[k] < 10) attrs[k] += 1;
    else i--;
  }
  const items = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 2));
  return {
    name: pick(NAMES),
    nickname: pick(NICKS),
    bio: pick(BIOS),
    classId: pick(CLASSES).id,
    attrs,
    items,
  };
}

export const MAX_PER_ATTR = 10;
