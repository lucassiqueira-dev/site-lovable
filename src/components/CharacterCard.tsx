import { ATTRIBUTES, CLASSES, MAX_PER_ATTR, TOTAL_POINTS, type Character } from "@/lib/rpg";

type Props = {
  character: Character;
  mode: "card" | "sheet";
};

export function CharacterCard({ character, mode }: Props) {
  const cls = CLASSES.find((c) => c.id === character.classId)!;
  const used = Object.values(character.attrs).reduce((a, b) => a + b, 0);

  if (mode === "sheet") {
    return (
      <div className="neon-panel w-full max-w-sm p-5 font-mono text-sm">
        <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
          <span className="neon-text font-display text-xs uppercase tracking-widest">Ficha Técnica</span>
          <span className="text-muted-foreground text-xs">v1.0.0</span>
        </div>
        <pre className="whitespace-pre-wrap break-words leading-relaxed text-foreground/90">
{`{
  "nome": "${character.name || "—"}",
  "nickname": "@${character.nickname || "anon"}",
  "classe": "${cls.name}",
  "bio": "${character.bio || "—"}",
  "atributos": {
${ATTRIBUTES.map((a) => `    "${a.label}": ${character.attrs[a.key]}`).join(",\n")}
  },
  "pontos_usados": ${used}/${TOTAL_POINTS},
  "inventario": [${character.items.map((i) => `"${i}"`).join(", ")}]
}`}
        </pre>
      </div>
    );
  }

  return (
    <div className="neon-panel scanlines animate-pulse-neon w-full max-w-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-primary/40 text-3xl"
          style={{ background: "var(--gradient-card)" }}
        >
          {cls.icon}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold neon-text">
            {character.name || "Sem Nome"}
          </h3>
          <p className="truncate font-mono text-xs text-accent">@{character.nickname || "anon"}</p>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
          Classe
        </p>
        <p className="text-base font-semibold text-foreground">{cls.name}</p>
        <p className="mt-2 text-sm italic text-muted-foreground">{character.bio || cls.tagline}</p>

        <div className="mt-4 space-y-2.5">
          {ATTRIBUTES.map((a) => {
            const v = character.attrs[a.key];
            return (
              <div key={a.key}>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-foreground/80">
                    {a.icon} {a.label}
                  </span>
                  <span className="text-primary">{v}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(v / MAX_PER_ATTR) * 100}%`,
                      background: "var(--gradient-neon)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Inventário
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {character.items.length === 0 && (
              <span className="text-xs text-muted-foreground">Mochila vazia...</span>
            )}
            {character.items.map((i) => (
              <span
                key={i}
                className="rounded-md border border-accent/40 bg-secondary/60 px-2 py-1 font-mono text-[0.7rem] text-accent"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        <span>DEV-RPG</span>
        <span>{used}/{TOTAL_POINTS} PTS</span>
      </div>
    </div>
  );
}
