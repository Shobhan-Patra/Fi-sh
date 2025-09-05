import Hero from "../components/Hero";
import Features from "../components/Features";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Hero />
      <Features />
    </div>
  );
}
