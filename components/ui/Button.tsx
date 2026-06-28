"use client";

import React from "react";

type Variant = "primary" | "ghost" | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  className?: string;
}

const cn = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(" ");

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantStyles: Record<Variant, string> = {
  // Voltaic design system — emerald brand accent
  primary:
    "bg-brand text-black hover:bg-brand-strong hover:shadow-glow focus:ring-brand focus:ring-offset-[2px] focus:ring-offset-bg",
  ghost:
    "bg-transparent text-text hover:bg-brand-soft hover:text-brand focus:ring-brand/50",
  outline:
    "bg-transparent border border-brand/40 text-text hover:border-brand hover:bg-brand-soft hover:text-brand focus:ring-brand/50",
};

const padding = "px-6 py-2";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant = "primary", type = "button", ...rest },
    ref
  ) => {
    const classes = cn(
      baseStyles,
      padding,
      variantStyles[variant],
      className ?? ""
    );

    return (
      <button ref={ref} className={classes} type={type} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;