import "@/app/globals.css";

/**
 * Root layout — minimal. The full shell (<html>, <body>, header, footer)
 * lives in [lang]/layout.tsx so the `lang` param is available for <html lang>.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
