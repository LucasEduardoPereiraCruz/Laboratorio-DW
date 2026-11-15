export default function Footer() {
  return (
    <footer className="w-full border-t border-emerald-100 bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center text-xs font-semibold text-emerald-700/70 tracking-wider">
        &copy; {new Date().getFullYear()} ECOFLUXO — TODOS OS DIREITOS RESERVADOS
      </div>
    </footer>
  );
}