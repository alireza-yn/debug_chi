// import Hero from "@/components/routes/debug/Hero";
// import HeroService from "@/components/routes/debug/Hero/HeroService";
// import OnlineDebugers from "@/components/routes/debug/OnlineDebugers";
// import DebugService from "@/components/routes/debug/Services";
// import { CardItem } from "@/components/ui/ace/evaluation-card";
// import React from "react";

// const HeroServiceName = [
//   "حل سریع مشکلات برنامه نویس",
//   "ارتباط مستقیم با کارشناس!",
//   "پشتیبانی در تمام حوزه ها",
//   "ارتباط چت ، تصویری و ریموت",
// ];

// const cards:CardItem[] = [
//   {
//     url:"/community/chat/6e6b2721-0bdd-42d3-803b-2db033cac0ac/?mode=profile",
//     title: "علی محمدی",
//     description: "متخصص دیباگ فرانت‌اند",
//     src: "/files/1.jpg",
//     ctaText: "مشاهده پروفایل",
//     ctaLink: "https://example.com/profile",
//     content:
//       "علی محمدی با بیش از ۸ سال تجربه در زمینه دیباگ و رفع مشکلات فرانت‌اند، متخصص در فریم‌ورک‌های React، Vue و Angular است. او توانایی بالایی در شناسایی و رفع مشکلات پیچیده رندرینگ، بهینه‌سازی عملکرد و حل مسائل مربوط به رابط کاربری دارد.\n\nمهارت‌های کلیدی:\n• تسلط کامل بر ابزارهای دیباگ مرورگر (Chrome DevTools)\n• بهینه‌سازی عملکرد و حافظه در اپلیکیشن‌های SPA\n• رفع مشکلات مربوط به حالت (State) و چرخه حیات کامپوننت‌ها\n• تجربه عمیق در حل مشکلات سازگاری بین مرورگرها",
//   },
//   {
//     url:"/community/chat/?uuid=asdad-5454sda",
//     title: "سارا رضایی",
//     description: "متخصص دیباگ بک‌اند",
//     src: "/files/2.jpg",
//     ctaText: "استخدام",
//     ctaLink: "https://example.com/hire",
//     content:
//       "سارا رضایی متخصص در زمینه دیباگ سیستم‌های بک‌اند و پایگاه‌های داده است. با ۱۰ سال سابقه کار در شرکت‌های نرم‌افزاری بزرگ، او تخصص ویژه‌ای در شناسایی و رفع گلوگاه‌های عملکردی و مشکلات امنیتی دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ سیستم‌های Node.js، Django و Laravel\n• بهینه‌سازی کوئری‌های پایگاه داده\n• رفع نشتی‌های حافظه و مشکلات همزمانی\n• تجزیه و تحلیل لاگ‌ها و ردیابی خطاها در سیستم‌های توزیع شده",
//   },
//   {
//     url:"/community/chat/?uuid=asdad-5454sda",

//     title: "محمد حسینی",
//     description: "متخصص دیباگ موبایل",
//     src: "/files/1.jpg",
//     ctaText: "مشاوره",
//     ctaLink: "https://example.com/consult",
//     content:
//       "محمد حسینی با تخصص در دیباگ اپلیکیشن‌های موبایل، بیش از ۷ سال تجربه در حل مشکلات پیچیده در پلتفرم‌های Android و iOS دارد. او همچنین در زمینه فریم‌ورک‌های کراس پلتفرم مانند React Native و Flutter تخصص دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر ابزارهای دیباگ Android Studio و Xcode\n• رفع مشکلات مصرف باتری و بهینه‌سازی عملکرد\n• دیباگ مشکلات مربوط به چرخه حیات اپلیکیشن\n• تجربه در حل مشکلات سازگاری با نسخه‌های مختلف سیستم عامل",
//   },
//   {
//     url:"/community/chat/?uuid=asdad-5454sda",

//     title: "زهرا کریمی",
//     description: "متخصص امنیت و دیباگ",
//     src: "/files/1.jpg",
//     ctaText: "همکاری",
//     ctaLink: "https://example.com/collaborate",
//     content:
//       "زهرا کریمی متخصص در زمینه امنیت سایبری و دیباگ مشکلات امنیتی است. با بیش از ۹ سال تجربه در تست نفوذ و ارزیابی آسیب‌پذیری، او توانایی بالایی در شناسایی و رفع مشکلات امنیتی در سیستم‌های نرم‌افزاری دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر تکنیک‌های دیباگ کد برای یافتن آسیب‌پذیری‌های امنیتی\n• تجربه در رفع مشکلات XSS، SQL Injection و CSRF\n• تحلیل کد برای یافتن نقاط ضعف امنیتی\n• آشنایی با استانداردهای OWASP و روش‌های امن‌سازی کد",
//   },
//   {
//     url:"/community/chat/?uuid=asdad-5454sda",

//     title: "امیر جعفری",
//     description: "متخصص دیباگ DevOps",
//     src: "/files/2.jpg",
//     ctaText: "تماس",
//     ctaLink: "/community/chat",
//     content:
//       "امیر جعفری متخصص در زمینه دیباگ سیستم‌های DevOps و زیرساخت‌های ابری است. با ۱۱ سال تجربه در پیاده‌سازی و نگهداری سیستم‌های CI/CD، او مهارت بالایی در عیب‌یابی و رفع مشکلات در محیط‌های پیچیده دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ مشکلات Docker و Kubernetes\n• رفع مشکلات مربوط به پایپلاین‌های CI/CD\n• عیب‌یابی سیستم‌های توزیع شده و میکروسرویس‌ها\n• بهینه‌سازی عملکرد و مقیاس‌پذیری در محیط‌های ابری",
//   },
//   {
//     url:"/community/chat/?uuid=asdad-5454sda",

//     title: "نیلوفر احمدی",
//     description: "متخصص دیباگ هوش مصنوعی",
//     src: "/files/1.jpg",
//     ctaText: "پروژه‌ها",
//     ctaLink: "/community/chat",
//     content:
//       "نیلوفر احمدی متخصص در زمینه دیباگ سیستم‌های هوش مصنوعی و یادگیری ماشین است. با ۶ سال تجربه در توسعه و بهینه‌سازی مدل‌های یادگیری عمیق، او توانایی بالایی در شناسایی و رفع مشکلات در پروژه‌های هوش مصنوعی دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ مدل‌های یادگیری عمیق با TensorFlow و PyTorch\n• رفع مشکلات مربوط به همگرایی و بیش‌برازش مدل‌ها\n• بهینه‌سازی عملکرد و مصرف منابع در سیستم‌های ML\n• تجربه در دیباگ پایپلاین‌های پردازش داده برای هوش مصنوعی",
//   },
//   {
//     url:"/community/chat/?uuid=asdad-5454sda",
//     title: "رضا محسنی",
//     description: "متخصص دیباگ بلاکچین",
//     src: "/files/2.jpg",
//     ctaText: "آموزش",
//     ctaLink: "/community/chat",
//     content:
//       "رضا محسنی متخصص در زمینه دیباگ قراردادهای هوشمند و اپلیکیشن‌های بلاکچین است. با ۵ سال تجربه در توسعه و عیب‌یابی پروژه‌های مبتنی بر اتریوم و سایر پلتفرم‌های بلاکچین، او مهارت بالایی در شناسایی و رفع مشکلات امنیتی و عملکردی دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ قراردادهای هوشمند Solidity\n• تجربه در استفاده از ابزارهای Truffle و Hardhat برای دیباگ\n• شناسایی و رفع آسیب‌پذیری‌های امنیتی در قراردادهای هوشمند\n• بهینه‌سازی مصرف گس و عملکرد در اپلیکیشن‌های غیرمتمرکز",
//   },
//   {
//     url:"/community/chat/?uuid=asdad-5454sda",
//     title: "مریم صادقی",
//     description: "متخصص دیباگ سیستم‌های تعبیه شده",
//     src: "/files/1.jpg",
//     ctaText: "رزومه",
//     ctaLink: "/community/chat/?uuid='asdasd-asdsad'",
//     content:
//       "مریم صادقی متخصص در زمینه دیباگ سیستم‌های تعبیه شده (Embedded Systems) است. با ۱۲ سال تجربه در توسعه و عیب‌یابی نرم‌افزارهای سطح پایین، او مهارت بالایی در شناسایی و رفع مشکلات در سیستم‌های IoT و میکروکنترلرها دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ کد C/C++ برای سیستم‌های تعبیه شده\n• تجربه در استفاده از دیباگرهای سخت‌افزاری و JTAG\n• عیب‌یابی مشکلات مربوط به زمان‌بندی و وقفه‌ها\n• بهینه‌سازی مصرف انرژی و عملکرد در سیستم‌های با منابع محدود",
//   },
// ]
// const page = () => {
//   return (
//     <main className="dark:bg-stone-900">
//       <div className="relative">
//         <Hero
//           header="در لحظه دیباگ کن"
//           button_title="در خواست دیباگ فوری"
//           url="/community/chat/ai?mode=starter"
//           description="مشکلت رو بگو، ما متخصص را پیدا می کنیم!"
//           description_2=" تا از طریق انی دسک ، تماس تصویری یا چت راه حل سریع و دقیق بگیری"
//         />
//         <HeroService data={HeroServiceName} />
//       </div>
//       <DebugService />
//       <OnlineDebugers title="دیباگر های آماده برای دریافت خدمات" button_title="دریافت خدمات" data={cards}/>
//     </main>
//   );
// };

// export default page;
import Sidebar from "@/components/version_1_1/Sidebar";
import SidebarBody from "@/components/version_1_1/Sidebar/SideBar";
import SidebarFooter from "@/components/version_1_1/Sidebar/sidebar-footer";
import React from "react";

const page = () => {
  return (
    <main className="w-full h-screen flex">
      <Sidebar>
        <SidebarBody />
        <SidebarFooter />
      </Sidebar>
      <div className="flex-1 h-full"></div>
    </main>
  );
};

export default page;
