import { ArrowRight, Compass, MessageCircle, Sparkles } from "lucide-react";

const paths = [
  {
    id: 1,
    title: "Jump in with Memo",
    description:
      "Start a conversation about whatever is present in your life right now.",
    icon: MessageCircle,
    href: "/memo",
  },
  {
    id: 2,
    title: "Begin with the foundations",
    description:
      "Follow a gentle introduction to reflection, Lojong, and everyday practice.",
    icon: Sparkles,
    href: "/foundations",
    recommended: true,
  },
  {
    id: 3,
    title: "Explore on your own",
    description:
      "Browse practices and teachings at your own pace.",
    icon: Compass,
    href: "/explore",
    disabled: true,
  },
];

export default function ChooseYourPath() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
          Begin
        </p>

        <h1 className="text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          Choose your path
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
          There is no correct place to begin. Choose what feels most useful
          today.
        </p>
      </div>

      <ul
        role="list"
        className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
      >
        {paths.map((path) => {
          const Icon = path.icon;

          return (
            <li
              key={path.id}
              className="border-b border-stone-200 last:border-b-0"
            >
              <a
                href={path.disabled ? undefined : path.href}
                aria-disabled={path.disabled}
                className={[
                  "group relative flex items-center gap-5 px-5 py-6 transition-colors sm:px-7",
                  path.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-stone-50",
                ].join(" ")}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                  <Icon className="size-5" strokeWidth={1.6} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-stone-900">
                      {path.title}
                    </h2>

                    {path.recommended && (
                      <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Recommended
                      </span>
                    )}

                    {path.disabled && (
                      <span className="text-xs font-medium text-stone-500">
                        Coming soon
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 max-w-lg text-sm leading-6 text-stone-600">
                    {path.description}
                  </p>
                </div>

                {!path.disabled && (
                  <ArrowRight
                    className="size-5 shrink-0 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-700"
                    strokeWidth={1.6}
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}