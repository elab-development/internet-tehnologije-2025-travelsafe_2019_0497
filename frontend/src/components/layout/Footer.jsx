export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <span>
          © {new Date().getFullYear()} Travel<span className="font-semibold text-brand-600">Safe</span> · Putno osiguranje
        </span>
        <span>Bezbedno putujte, mi brinemo o ostalom.</span>
      </div>
    </footer>
  )
}
