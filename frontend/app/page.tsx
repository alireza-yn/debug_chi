import Header from "@/components/Layout/Header";
import Tabs from "@/components/Layout/Tabs";
import ClassInfo from "@/components/routes/home/ClassInfo";
import Hero from "@/components/routes/home/Hero";
import LiveUsers from "@/components/routes/home/LiveDebugers";
import MainSLider from "@/components/routes/home/MainSlider";
import NavCard from "@/components/routes/home/NavCard";
import Services from "@/components/routes/home/Services";
import Slider from "@/components/routes/home/Slider";
import ChatSpcket from "@/components/Socket/ChatSpcket";
import SockectTest from "@/components/Socket/SockectTest";
import { LinearGradiant } from "@/components/Tools/LinearGradiant";
import { ThreeDCardDemo } from "@/components/ui/ace/Test";
import * as React from "react";
import { service } from "@/components/routes/home/Services/data";
import { LogoIcon } from "@/components/ui/icons";
import { Chip } from "@heroui/react";
import { data } from "@/components/routes/home/ClassInfo/data";




export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto gap-10">
      <div className="max-w-7xl">
        <Slider />
      </div>
      <Services data={service} title="خدمات" title_placement="justify-center"/>
      <LiveUsers />
      <ClassInfo data={data} title={"آموزش"} highlight="دیباگچی" special="ویژه مبدتیان"/>

     
    </div>
  );
}
