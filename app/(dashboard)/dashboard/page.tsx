import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const FASES = [
  {
    letra: "C",
    nombre: "Conciencia",
    descripcion: "Ver tu punto A real y tu relación con el dinero.",
  },
  {
    letra: "L",
    nombre: "Liberación",
    descripcion: "Soltar el caos operativo y las creencias que te frenan.",
  },
  {
    letra: "I",
    nombre: "Identidad",
    descripcion: "Construir quién eres como profesional posicionado.",
  },
  {
    letra: "N",
    nombre: "Narrativa",
    descripcion: "Tu comunicación y tu marca, auténticas.",
  },
  {
    letra: "I",
    nombre: "Instalación",
    descripcion: "Montar el sistema: captación, app, cobro.",
  },
  {
    letra: "C",
    nombre: "Cobro",
    descripcion: "Cobrar sin fricción, de forma automática.",
  },
  {
    letra: "A",
    nombre: "Autonomía",
    descripcion: "El sistema funciona sin ti.",
  },
] as const;

const NAV_LINKS = [
  { href: "/dashboard", label: "Inicio" },
  { href: "#", label: "Coach IA" },
  { href: "#", label: "El Método CLINICA" },
  { href: "#", label: "Configuración" },
] as const;

function getNombre(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim().split(/\s+/)[0];
  }
  const local = user.email?.split("@")[0] ?? "";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function getFechaHoy() {
  const raw = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nombre = user ? getNombre(user) : "";
  const fechaHoy = getFechaHoy();

  return (
    <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-white/10 bg-[#080808] px-5 py-8">
        <div className="mb-8">
          <p className="text-xl font-semibold text-[#E8962E]">MiClínica</p>
          <p className="mt-1 truncate text-xs text-white/40">{user?.email}</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-[#E8962E] ${
                link.href === "/dashboard"
                  ? "bg-white/5 text-[#E8962E]"
                  : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            Cerrar Sesión
          </button>
        </form>
      </aside>

      {/* Contenido principal */}
      <main className="ml-64 flex-1 px-8 py-10 lg:px-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Bienvenido, {nombre}
          </h1>
          <p className="mt-2 text-sm text-white/50">{fechaHoy}</p>
        </header>

        {/* Tu Cinturón Actual */}
        <section className="mb-12">
          <div className="rounded-xl border border-[#E8962E]/30 bg-[#0f0f0f] p-6 lg:p-8">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/50">
              Tu Cinturón Actual
            </h2>
            <p className="text-3xl font-semibold text-white">Cinturón Blanco</p>
            <p className="mt-2 text-base italic text-white/60">
              La semilla bajo tierra.
            </p>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-white/40">
                <span>Progreso</span>
                <span>0 de 106 pasos</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#E8962E]"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* El Método CLINICA */}
        <section>
          <h2 className="mb-6 text-xl font-semibold">
            El Método{" "}
            <span className="text-[#3D6B4F]">CLINICA</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {FASES.map((fase) => (
              <article
                key={fase.nombre}
                className="flex flex-col rounded-xl border border-white/10 bg-[#0f0f0f] p-5 transition-colors hover:border-white/20"
              >
                <span className="text-4xl font-bold leading-none text-[#E8962E]">
                  {fase.letra}
                </span>
                <h3 className="mt-3 text-base font-semibold">{fase.nombre}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                  {fase.descripcion}
                </p>
                <p className="mt-4 text-xs text-white/30">Próximamente</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
