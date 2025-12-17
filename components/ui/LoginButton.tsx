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

  // PRIMARY → #EC8E45
  primary:
    "bg-[#EC8E45] text-white hover:bg-[#d67a34] active:bg-[#b9652b] shadow-md",

  // GHOST
  ghost:
    "bg-transparent text-white hover:bg-white/10 border border-white/10",

  // OUTLINE
  outline:
    "bg-transparent text-[#EC8E45]  hover:bg-[#EC8E45] hover:text-black",
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
