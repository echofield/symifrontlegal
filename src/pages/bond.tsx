import { useEffect } from "react";
import { useRouter } from "next/router";

export default function BondIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/bond/create");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary-600">Redirection</p>
        <h1 className="text-2xl font-semibold text-slate-800">Chargement du configurateur Bond…</h1>
      </div>
    </div>
  );
}
