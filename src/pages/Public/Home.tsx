import Navbar from "../../components/navbar/Navbar";
import CategoriesSection from "../../components/home/CategoriesSection";
import HomeCta from "../../components/home/HomeCta";
import HomeFooter from "../../components/home/HomeFooter";
import HomeHero from "../../components/home/HomeHero";
import PopularSection from "../../components/home/PopularSection";
import StatsStrip from "../../components/home/StatsStrip";
import { useAuth } from "../../hooks/Auth/useAuth";

export default function Home() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />
      <main>
        <HomeHero isAuthenticated={isAuthenticated} />
        <StatsStrip />
        <CategoriesSection />
        <PopularSection />
        <HomeCta isAuthenticated={isAuthenticated} />
      </main>
      <HomeFooter />
    </div>
  );
}
