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
  base: "inline-flex items-center gap-2 font-semibold rounded-full transition-all px-6 py-2",

  // PRIMARY → #155cfc
  primary:
    "bg-[#155cfc] text-white hover:bg-[#155cfc] active:bg-[#155cfc] shadow-md",

  // GHOST
  ghost:
    "bg-transparent text-white hover:bg-white/10 border border-white/10",

  // OUTLINE
  outline:
    "bg-transparent text-[#155cfc]  hover:bg-[#155cfc] hover:text-black",
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
