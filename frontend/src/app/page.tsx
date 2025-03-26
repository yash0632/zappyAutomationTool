
import Appbar from "@/components/Appbar";
import { ModeToggle } from "@/components/Darkmode";
import Hero from "@/components/Hero";
import HeroVideo from "@/components/HeroVideo";

export default function Home() {
  return (
    <main className="w-screen h-screen border-box">
      
      <div className="w-full h-full flex flex-col gap-y-4">
        <Appbar/>
        <Hero/>
        <HeroVideo/>
      </div>
      
    </main>
  );
}
