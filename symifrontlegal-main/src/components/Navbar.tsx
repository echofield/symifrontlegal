"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/pricing#documents", label: "Modèles" },
  { href: "/bond/create", label: "Bond" },
  { href: "/conseiller", label: "Conseiller" },
  { href: "/pricing", label: "Prix" },
  { href: "/documentation", label: "Documentation" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState<string>("");

  useEffect(() => {
    setCurrentHash(window.location.hash);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    setCurrentHash(window.location.hash);
  }, [pathname]);

  const isActive = (href: string) => {
    const [pathOnly, hash] = href.split("#");
    if (!pathOnly) return false;
    if (hash) {
      return pathname === pathOnly && currentHash === `#${hash}`;
    }
    if (pathOnly === "/") {
      return pathname === "/";
    }
    return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-blue-100">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-blue-700">
          SYMI Legal
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-white bg-blue-600 shadow-sm"
                  : "text-blue-700 hover:bg-blue-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
