import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/elevatehq-logo-dark-playfair.svg" alt="" width={36} height={36} />
            <span className="font-serif text-lg">Elevate HQ admin</span>
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="text-white/80 hover:text-gold" target="_blank">View site</Link>
            <form action={logout}>
              <button type="submit" className="text-white/80 hover:text-gold">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
