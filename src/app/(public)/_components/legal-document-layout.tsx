import Link from "next/link";

import { cn } from "@/lib/utils";
import type { LegalSection } from "@/app/(public)/_lib/legal-content";

interface LegalDocumentLayoutProps {
  title: string;
  summary: string;
  effectiveDate: string;
  lastUpdatedDate: string;
  sections: LegalSection[];
  alternateHref: string;
  alternateLabel: string;
}

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-24 border-t border-border/70 pt-8">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{section.title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.items?.length ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground sm:text-base">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function LegalDocumentLayout({
  title,
  summary,
  effectiveDate,
  lastUpdatedDate,
  sections,
  alternateHref,
  alternateLabel
}: LegalDocumentLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="border-b border-border/70 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Today&apos;s Nail Legal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{summary}</p>
        <dl className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">시행일</dt>
            <dd>{effectiveDate}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">최종 업데이트</dt>
            <dd>{lastUpdatedDate}</dd>
          </div>
        </dl>
      </header>

      <nav
        aria-label="문서 목차"
        className={cn(
          "mt-8 rounded-2xl border border-border/70 bg-card/70 p-4",
          "backdrop-blur supports-[backdrop-filter]:bg-card/60"
        )}
      >
        <p className="text-sm font-medium text-foreground">목차</p>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a className="transition-colors hover:text-foreground" href={`#${section.id}`}>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>

      <footer className="mt-10 border-t border-border/70 pt-6 text-sm text-muted-foreground">
        <Link className="font-medium text-foreground underline underline-offset-4" href={alternateHref}>
          {alternateLabel}
        </Link>
      </footer>
    </main>
  );
}
