import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import RankShowcase from "@/components/rank-showcase";
import ServerStats from "@/components/server-stats";
import Footer from "@/components/footer";
import FallingLeaves from "@/components/falling-leaves";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Ambient Color Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-leaf-green/10 rounded-full animate-ambient-float-1"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-leaf-orange/8 rounded-full animate-ambient-float-2"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-leaf-purple/6 rounded-full animate-ambient-float-3"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-green-500/5 rounded-full animate-ambient-float-4"></div>
      </div>
      <FallingLeaves />
      <Header />
      <HeroSection />
      <RankShowcase />
      <ServerStats />
      <Footer />
    </div>
  );
}
