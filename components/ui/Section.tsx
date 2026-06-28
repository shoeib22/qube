"use client";

import React from "react";

const cn = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(" ");

export interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Mono uppercase brand label rendered above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: React.ReactNode;
  /** Supporting copy under the title. */
  subtitle?: React.ReactNode;
  /** Center the header block. */
  centered?: boolean;
  /** Constrain inner content width. */
  width?: "default" | "wide" | "full";
}

const widthMap = {
  default: "max-w-7xl",
  wide: "max-w-[88rem]",
  full: "max-w-none",
} as const;

/**
 * Section — standard page section wrapper for the Voltaic design system.
 * Provides consistent vertical rhythm, max-width, and an optional
 * eyebrow + title + subtitle header so every section reads as one family.
 */
export default function Section({
  eyebrow,
  title,
  subtitle,
  centered = false,
  width = "default",
  className,
  children,
  ...rest
}: SectionProps) {
  const hasHeader = eyebrow || title || subtitle;
  return (
    <section
      className={cn("relative w-full py-24 px-6", className)}
      {...rest}
    >
      <div className={cn("mx-auto", widthMap[width])}>
        {hasHeader && (
          <div
            className={cn(
              "mb-16 max-w-2xl",
              centered && "mx-auto text-center"
            )}
          >
            {eyebrow && (
              <span className="eyebrow inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-tight text-text">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-5 text-lg text-muted font-light leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
