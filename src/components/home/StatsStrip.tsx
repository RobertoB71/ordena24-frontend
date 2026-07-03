import { stats } from "./homeData";

export default function StatsStrip() {
  return (
    <section className="bg-orange-500">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 text-center text-white sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-serif text-4xl font-black leading-none">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium text-orange-50">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
