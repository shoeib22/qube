// app/configurator/page.tsx
// Redirects /configurator → /configurator/panel

import { redirect } from "next/navigation";


export default function ConfiguratorIndexPage() {
  redirect("/configurator/panel");
}