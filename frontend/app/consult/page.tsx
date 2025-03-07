import Hero from "@/components/routes/debug/Hero";
import HeroService from "@/components/routes/debug/Hero/HeroService";
import Services from "@/components/routes/debug/Services";
import React from "react";

type Props = {};
const HeroServiceName = [
  "پشتیبانی کامل",
  "زمان بندی دلخواه",
  "متخصص حرفه ای",
  "سریع و فوری",
];
const page = () => {
  return (
    <main>
      <div className="relative">
        <Hero
          header="فوری، مشاوره بگیر !"
          button_title="در خواست مشاوره فوری"
          url="/community/chat"
          description="مشکلت رو بگو، ما متخصص را پیدا می کنیم!"
          description_2="تا از طریق انی دسک ، تماس تصویری یا چت راه حل سریع و دقیق بگیری"
        />

        <HeroService data={HeroServiceName} />
      </div>
      <Services />
    </main>
  );
};

export default page;
// مشکلت رو بگو، ما متخصص را پیدا می کنیم!
// سریع، دقیق و مطمئن - بهترین مشاور برنامه نویسی درکنارته