import Header from "@/components/Layout/Header";
import Tabs from "@/components/Layout/Tabs";
import Hero from "@/components/routes/home/Hero";
import MainSLider from "@/components/routes/home/MainSlider";
import NavCard from "@/components/routes/home/NavCard";
import Services from "@/components/routes/home/Services";
import Slider from "@/components/routes/home/Slider";
import ChatSpcket from "@/components/Socket/ChatSpcket";
import SockectTest from "@/components/Socket/SockectTest";
import {LinearGradiant} from "@/components/Tools/LinearGradiant";
import { ThreeDCardDemo } from "@/components/ui/ace/Test";
import * as React from "react";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto gap-4">
      <div className="max-w-7xl mt-20">

      <Slider />
      </div>
      <Services />
      <ThreeDCardDemo />
      {/* <Hero />
      <div className="w-full h-[500px]  dark:bg-violet-950 relative bg-dotted-pattern">
        <h2 className="text-background absolute top-[40%] right-10 z-50 border rounded-xl w-1/4 h-10 text-center">کلاس های ویژه</h2>
        <LinearGradiant from="from-green-500" to="to-transparent" />
        <MainSLider />
      </div>
      <NavCard />
      <Services /> */}
      {/* <Header /> */}
    </div>
  );
}
