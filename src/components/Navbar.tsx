import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

const NAV_ITEMS = [
  { href: "/contracts", label: "Modèles" },
  { href: "/bond/create", label: "Bond" },
  { href: "/conseiller", label: "Conseiller" },
  { href: "/pricing", label: "Prix" },
  { href: "/documentation", label: "Documentation" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const router = useRouter();

  const activePath = useMemo(() => {
    if (!router.pathname) return "";
    if (router.pathname.startsWith("/bond")) return "/bond/create";
    return router.pathname;
  }, [router.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary-700">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white font-bold">
            SY
          </span>
          <span>SYMI Legal</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white shadow"
                    : "text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
