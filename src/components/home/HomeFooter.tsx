export default function HomeFooter() {
  return (
    <footer className="bg-[#260900] py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 text-left sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-serif text-3xl font-black text-white">
            Ordena<span className="text-orange-500">24</span>
          </p>
          <p className="mt-2 text-sm text-orange-100">
            Comida deliciosa a tu puerta, siempre.
          </p>
        </div>

        <p className="text-sm text-orange-100/70">
          © 2026 Ordena24. Todos los derechos reservados Proyecto Final.
        </p>
      </div>
    </footer>
  );
}
