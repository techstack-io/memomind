import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  LayoutGrid,
  MessageCircle,
  Mountain,
} from "lucide-react";

const ENTRY_POINTS = [
  {
    title: "Foundations",
    eyebrow: "Train in the Preliminaries",
    description:
      "Build the grounding needed for deeper reflection and everyday practice.",
    progressLabel: "Begin with the Four Reminders",
    action: "Continue",
    href: "/preliminaries/four-reminders",
    image: "/cards/foundations4.jpeg",
    icon: Mountain,
    featured: true,
  },
  {
    title: "Memo",
    eyebrow: "Reflect",
    description:
      "Begin with whatever is present in your life and explore it through conversation.",
    progressLabel: "Start a new reflection",
    action: "Talk with Memo",
    href: "/conversation",
    image: "/cards/memo.jpeg",
    icon: MessageCircle,
    featured: false,
  },
  {
    title: "Library",
    eyebrow: "Explore",
    description:
      "Browse practices, teachings, and contemplations at your own pace.",
    progressLabel: "Find something to practice",
    action: "Browse Library",
    href: "/library",
    image: "/cards/library2.jpeg",
    icon: BookOpen,
    featured: false,
  },
] as const;

const SIDEBAR_NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
    active: true,
  },
  {
    label: "Library",
    href: "/library",
    icon: BookOpen,
    active: false,
  },
  {
    label: "Journey",
    href: "/journey",
    icon: Compass,
    active: false,
  },
] as const;

type MemoMindDashboardProps = {
  userName?: string;
};

export default function MemoMindDashboard({
  userName = "Dan",
}: MemoMindDashboardProps) {
  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-3xl border border-memo-divider bg-memo-surface p-5 md:flex">
          <nav
            className="flex flex-col gap-1"
            aria-label="Dashboard navigation"
          >
            {SIDEBAR_NAV.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    item.active
                      ? "bg-memo-connection-100 font-semibold text-memo-connection-700"
                      : "text-memo-neutral-700 hover:bg-memo-neutral-100 hover:text-memo-text"
                  }`}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 py-4 md:py-8">
          <div className="mx-auto max-w-6xl">
            <header className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-memo-connection-600">
                Good morning, {userName}
              </p>

              <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-[-0.035em] text-slate-700 sm:text-5xl">
                Where should we begin?
              </h1>

              <p className="mt-4 text-base leading-relaxed text-memo-neutral-700">
                Choose what feels most useful today.
              </p>
            </header>

            <section
              className="mt-10 grid gap-6 lg:grid-cols-3"
              aria-label="Ways to begin"
            >
              {ENTRY_POINTS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex overflow-hidden rounded-[26px] border border-memo-divider bg-memo-surface transition-all duration-300 hover:-translate-y-1 hover:border-memo-connection-300 hover:shadow-[0_20px_55px_rgba(42,36,31,0.09)] lg:flex-col"
                  >
                    <div className="relative min-h-40 w-[42%] shrink-0 overflow-hidden bg-memo-neutral-100 lg:aspect-[16/10] lg:min-h-0 lg:w-full">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 40vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />

                      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_14px_rgba(42,36,31,0.10)]" />

                      {item.featured && (
                        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-memo-connection-700 backdrop-blur-sm">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-memo-connection-600">
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          {item.eyebrow}
                        </span>
                      </div>

                      <h2 className="mt-4 font-heading text-2xl leading-tight tracking-[-0.025em]">
                        {item.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-memo-neutral-700">
                        {item.description}
                      </p>

                      <div className="mt-auto pt-6">
                        <p className="text-xs text-memo-neutral-500">
                          {item.progressLabel}
                        </p>

                        <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                          {item.action}

                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}