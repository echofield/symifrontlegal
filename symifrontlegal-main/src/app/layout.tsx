import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "SYMI Legal",
    template: "%s | SYMI Legal",
  },
  description: "Contrats sécurisés, assistants juridiques et solutions Legal Ops pour les indépendants et entreprises.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <div className="min-h-screen pt-24 pb-12">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
