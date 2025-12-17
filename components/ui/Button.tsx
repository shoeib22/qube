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
  "inline-flex items-center justify-center rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-orange-400 text-black hover:bg-orange-600 focus:ring-orange-400 focus:ring-offset-[6px]",
  ghost: "bg-transparent text-white hover:bg-white/5 focus:ring-white/20",
  outline:
    "bg-transparent border border-white/10 text-white hover:border-white/20 focus:ring-white/20",
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
