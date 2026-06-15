"use client";

import Link from "next/link";
import Script from "next/script";
import { ChevronRight, Home } from "lucide-react";
import { breadcrumbJsonLd } from "../lib/seo";

export function Breadcrumbs({ items }) {
  const schemaData = breadcrumbJsonLd(items);
  const scriptId = `breadcrumbs-ld-${items.map((i) => i.name.replace(/\s+/g, "-").toLowerCase()).join("-")}`;

  return (
    <>
      <Script id={scriptId} type="application/ld+json">
        {JSON.stringify(schemaData)}
      </Script>

      <nav aria-label="Breadcrumb" className="mb-8 flex items-center overflow-x-auto whitespace-nowrap py-2 text-sm text-slate-400">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <Home size={14} className="shrink-0 text-slate-400" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            // Skip the first "Home" item since it is already hardcoded above
            if (item.path === "/") return null;

            return (
              <li key={item.path} className="flex items-center">
                <ChevronRight size={14} className="mx-1 shrink-0 text-slate-500" />
                {isLast ? (
                  <span className="font-semibold text-purple-400 select-none truncate max-w-44 sm:max-w-xs" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="transition hover:text-white truncate max-w-44 sm:max-w-xs"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
