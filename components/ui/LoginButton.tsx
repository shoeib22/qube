"use client";

import React from "react";
import { LogIn } from "lucide-react";

interface LoginButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: boolean;
  variant?: "primary" | "ghost" | "outline";
}

const styles = {
  base: "inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-200 px-6 py-2",

  // PRIMARY → emerald brand
  primary:
    "bg-brand text-black hover:bg-brand-strong hover:shadow-glow active:scale-95",

  // GHOST
  ghost:
    "bg-transparent text-text hover:bg-white/10 border border-border",

  // OUTLINE
  outline:
    "bg-transparent border border-brand/40 text-brand hover:bg-brand hover:text-black hover:border-brand",
};

export default function LoginButton({
  label = "Login",
  icon = true,
  variant = "primary",
  className = "",
  ...props
}: LoginButtonProps) {
  return (
    <button
      {...props}
      className={`${styles.base} ${styles[variant]} ${className}`}
    >
      {icon && <LogIn className="w-4 h-4" />}
      {label}
    </button>
  );
}
