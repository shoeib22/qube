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
  // Updated from orange to #155cfc
  primary:
    "bg-[#155cfc] text-white hover:bg-[#155cfc]/50 focus:ring-[#155cfc] focus:ring-offset-[2px] focus:ring-offset-black",
  ghost: 
    "bg-transparent text-white hover:bg-[#155cfc]/10 focus:ring-[#155cfc]/50",
  outline:
    "bg-transparent border border-[#155cfc]/40 text-white hover:border-[#155cfc] hover:bg-[#155cfc]/50 focus:ring-[#155cfc]/50",
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