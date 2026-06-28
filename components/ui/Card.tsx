"use client";

import React from "react";

const cn = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(" ");

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds an interactive hover lift + border brighten. */
  interactive?: boolean;
  /** Padding scale. */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

/**
 * Card — the canonical glass surface of the Voltaic design system.
 * Wraps the `.surface` utility so every panel across the site shares one
 * fill / border / radius / blur recipe.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { children, className, interactive = false, padding = "md", ...rest },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "surface",
          paddingMap[padding],
          interactive && "surface-hover hover:-translate-y-1",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
