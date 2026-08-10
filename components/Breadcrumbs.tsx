import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";
import { JsonLd } from "./JsonLd";

/**
 * Breadcrumb trail — the visible one and the BreadcrumbList markup, built from
 * the same array. Google expects the markup to describe a trail the visitor can
 * actually see, so emitting both from one source is what stops them drifting
 * apart the next time a label is reworded.
 *
 * The last crumb is the current page: rendered as plain text rather than a link
 * (a link to the page you are on is noise for both readers and crawlers) but
 * still included in the markup, which is what Google's spec asks for.
 */
export function Breadcrumbs({
  crumbs,
  className = "",
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <nav
        aria-label="Breadcrumb"
        className={`flex flex-wrap items-center gap-1.5 text-sm text-ink-soft ${className}`}
      >
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight size={14} className="text-ink-soft/50" />
              )}
              {isLast ? (
                <span aria-current="page" className="text-ink">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="transition-colors hover:text-green"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
