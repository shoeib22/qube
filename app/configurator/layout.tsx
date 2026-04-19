// app/configurator/layout.tsx
// Wraps all configurator steps with the shared context provider

import { ConfiguratorProvider } from "../../context/ConfiguratorContext";
import { ReactNode } from "react";

export const metadata = {
  title: "Panel Configurator | Xerovolt",
  description: "Design your custom Xerovolt smart switch panel — choose panel, material, size, icons, color, and technology.",
};

export default function ConfiguratorRootLayout({ children }: { children: ReactNode }) {
  return (
    <ConfiguratorProvider>
        
      {children}
    </ConfiguratorProvider>
  );
}