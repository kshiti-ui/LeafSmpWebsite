import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import RankShowcase from "@/components/rank-showcase";
import ServerStats from "@/components/server-stats";
import Footer from "@/components/footer";
import FallingLeaves from "@/components/falling-leaves";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <FallingLeaves />
      <Header />
      <HeroSection />
      <RankShowcase />
      <ServerStats />
      <Footer />
    </div>
  );
}
