import Footer from "@/components/Layout/Footer";
import { MacbookScroll } from "@/components/ui/ace/mac-book";
import CtaSection from "@/components/version_1_1/Landing/cta-section";
import Features from "@/components/version_1_1/Landing/features";
import Header from "@/components/version_1_1/Landing/header";
import Hero from "@/components/version_1_1/Landing/hero";
import KeyFeatures from "@/components/version_1_1/Landing/key-features";
import MainFeature from "@/components/version_1_1/Landing/main-feature";
import MapSection from "@/components/version_1_1/Landing/map-section";
import Roadmap from "@/components/version_1_1/Landing/Roadmap";
import Testimonials from "@/components/version_1_1/Landing/testimonials";
import Video from "@/components/version_1_1/Landing/Video";
import WhyWorkingWithUs from "@/components/version_1_1/Landing/why-working";
import { Badge } from "lucide-react";
import Link from "next/link";

export const page = () => {
  return (
    <main
      className="min-h-screen font-x bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <Header />
      <Hero />
      {/* <Features /> */}
      <WhyWorkingWithUs />
      <Roadmap />
      {/* <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
        <MacbookScroll
          title={<span>مراحل درخواست برنامه نویس</span>}
          badge={
            <Link href="https://peerlist.io/manuarora">
              <Badge className="h-10 w-10 transform -rotate-12" />
            </Link>
          }
          src={"/landing/card_light.svg"}
          dark_src={"/landing/card_light.svg"}
          showGradient={false}
        />
      </div> */}
      <Video />
      {/* <MainFeature /> */}
      {/* <KeyFeatures /> */}
      <CtaSection />
      <Testimonials />
      <MapSection />
      {/* <Footer /> */}
      <Footer />
    </main>
  );
};
export default page;
