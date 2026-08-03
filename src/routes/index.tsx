import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CharacterCard } from "@/components/CharacterCard";
import {
  ATTRIBUTES,
  CLASSES,
  MAX_PER_ATTR,
  TOTAL_POINTS,
  emptyAttrs,
  randomCharacter,
  type AttrKey,
  type Character,
} from "@/lib/rpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gerador de Ficha de Personagem RPG Dev Geek" },
      {
        name: "description",
        content:
          "Monte sua ficha de RPG dev: classe, atributos, inventário de skills e card colecionável neon para baixar.",
      },
      { property: "og:title", content: "Gerador de Ficha de Personagem RPG Dev" },
      {
        property: "og:description",
        content: "Crie seu personagem dev cyberpunk com atributos, inventário e card exportável.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [character, setCharacter] = useState<Character>({
    name: "",
    nickname: "",
    bio: "",
    classId: "backend",
    attrs: { ...emptyAttrs },
    items: [],
  });
  const [mode, setMode] = useState<"card" | "sheet">("card");
  const [itemInput, setItemInput] = useState("");
  const [status, setStatus] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const used = Object.values(character.attrs).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_POINTS - used;

  const set = (patch: Partial<Character>) => setCharacter((c) => ({ ...c, ...patch }));

  const adjust = (key: AttrKey, delta: number) => {
    setCharacter((c) => {
      const next = c.attrs[key] + delta;
      const total = Object.values(c.attrs).reduce((a, b) => a + b, 0);
      if (next < 0 || next > MAX_PER_ATTR) return c;
      if (delta > 0 && total >= TOTAL_POINTS) return c;
      return { ...c, attrs: { ...c.attrs, [key]: next } };
    });
  };

  const addItem = () => {
    const v = itemInput.trim();
    if (!v || character.items.includes(v)) return;
    set({ items: [...character.items, v] });
    setItemInput("");
  };

  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2200);
  };

  const download = async () => {
    if (!cardRef.current) return;
    const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = `ficha-${character.nickname || "dev"}.png`;
    a.click();
    flash("Imagem baixada!");
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(JSON.stringify(character, null, 2));
    flash("Código do card copiado!");
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
          // character_builder.exe
        </p>
        <h1 className="mt-2 text-3xl font-black neon-text sm:text-5xl">FICHA DE DEV RPG</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Distribua {TOTAL_POINTS} pontos, escolha sua classe, equipe suas skills e leve seu card
          colecionável para o mundo.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* Formulário */}
        <section className="neon-panel space-y-6 p-5 sm:p-6">
          <div className="space-y-3">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              01 — Identidade
            </h2>
            <Input
              placeholder="Nome do Dev / Personagem"
              value={character.name}
              onChange={(e) => set({ name: e.target.value })}
            />
            <Input
              placeholder="Nickname (ex: null_pointer)"
              value={character.nickname}
              onChange={(e) => set({ nickname: e.target.value })}
            />
            <Textarea
              placeholder="Bio curta..."
              rows={2}
              value={character.bio}
              onChange={(e) => set({ bio: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              02 — Classe
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {CLASSES.map((c) => {
                const active = c.id === character.classId;
                return (
                  <button
                    key={c.id}
                    onClick={() => set({ classId: c.id })}
                    className={`flex min-w-0 items-center gap-2 rounded-lg border p-3 text-left transition-all duration-200 hover:scale-[1.02] ${
                      active
                        ? "border-primary bg-secondary shadow-[var(--shadow-neon)]"
                        : "border-border bg-secondary/40 hover:border-accent/60"
                    }`}
                  >
                    <span className="shrink-0 text-2xl">{c.icon}</span>
                    <span className="min-w-0 text-sm font-semibold leading-tight">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="min-w-0 truncate font-display text-sm uppercase tracking-[0.2em] text-primary">
                03 — Atributos
              </h2>
              <span
                className={`shrink-0 rounded-md border px-2 py-1 font-mono text-xs ${
                  remaining === 0
                    ? "border-accent/50 text-accent"
                    : "border-primary/50 text-primary"
                }`}
              >
                {remaining} pts restantes
              </span>
            </div>
            {ATTRIBUTES.map((a) => (
              <div key={a.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="truncate">
                      {a.icon} {a.label}
                    </span>
                    <span className="text-primary">{character.attrs[a.key]}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${(character.attrs[a.key] / MAX_PER_ATTR) * 100}%`,
                        background: "var(--gradient-neon)",
                      }}
                    />
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 transition-transform active:scale-90"
                    aria-label={`Diminuir ${a.label}`}
                    disabled={character.attrs[a.key] === 0}
                    onClick={() => adjust(a.key, -1)}
                  >
                    −
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 transition-transform active:scale-90"
                    aria-label={`Aumentar ${a.label}`}
                    disabled={remaining === 0 || character.attrs[a.key] === MAX_PER_ATTR}
                    onClick={() => adjust(a.key, 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-primary">
              04 — Inventário
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Espada de React..."
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
              />
              <Button onClick={addItem} className="shrink-0">
                Equipar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {character.items.map((i) => (
                <button
                  key={i}
                  onClick={() => set({ items: character.items.filter((x) => x !== i) })}
                  className="group rounded-md border border-accent/40 bg-secondary/60 px-2.5 py-1 font-mono text-xs text-accent transition-colors hover:border-destructive hover:text-destructive"
                >
                  {i} <span className="opacity-60 group-hover:opacity-100">×</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button variant="secondary" onClick={() => setCharacter(randomCharacter())}>
              🎲 Ficha Aleatória
            </Button>
            <Button variant="outline" onClick={download}>
              ⬇ Baixar Imagem
            </Button>
            <Button variant="outline" onClick={copyCode}>
              ⧉ Copiar Código
            </Button>
          </div>
          <p aria-live="polite" className="min-h-4 font-mono text-xs text-neon-lime">
            {status}
          </p>
        </section>

        {/* Preview */}
        <section className="lg:sticky lg:top-8 lg:self-start">
          <div className="mb-4 flex justify-center gap-2">
            {(["card", "sheet"] as const).map((m) => (
              <Button
                key={m}
                size="sm"
                variant={mode === m ? "default" : "outline"}
                onClick={() => setMode(m)}
              >
                {m === "card" ? "Carta de Colecionador" : "Ficha Técnica"}
              </Button>
            ))}
          </div>
          <div ref={cardRef} className="flex justify-center animate-fade-in">
            <CharacterCard character={character} mode={mode} />
          </div>
        </section>
      </div>
    </main>
  );
}
