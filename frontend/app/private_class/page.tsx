import Hero from '@/components/routes/debug/Hero';
import HeroService from '@/components/routes/debug/Hero/HeroService';
import OnlineDebugers from '@/components/routes/debug/OnlineDebugers';
import ClassInfo from '@/components/routes/home/ClassInfo';
import Services from '@/components/routes/home/Services';
import { CardItem } from '@/components/ui/ace/evaluation-card';
import { DebugServiceIcon } from '@/components/ui/icons';
import { Home } from 'lucide-react';
import React from 'react'

const HeroServiceName = [
    "همه چیز در اختیار توئه",
    "بهترین آموزش",
    "سریعترین زمان",
    "حرفه ای ترین مدرس",
  ];
const service = [
  {
    name: "توسعه وب",
    icon: "/svg/Rectangle 125.svg",
    url: "/assistent/request/?query=Web Development",
  },
  {
    name: "اپلیکیشن موبایل",
    icon: "/svg/Rectangle 126.svg",
    url: "/assistent/request/?query=Mobile App",
  },
  {
    name: "نرم افزار ویندوز",
    icon: "/svg/Rectangle 127.svg",
    url: "/assistent/request/?query=Windows Software",
  },
  {
    name: "بازی سازی",
    icon: "/svg/Rectangle 128.svg",
    url: "/assistent/request/?query=Game Development",
  },
  {
    name: "داده هوش مصنوعی",
    icon: <DebugServiceIcon />,
    url: "/assistent/request/?query=AI Data",
  },
  {
    name: "بلاکچین،وب 3",
    icon: "/svg/Rectangle 129.svg",
    url: "/assistent/request/?query=Blockchain, Web 3",
  },
  {
    name: "امنیت و هک قانونمند",
    icon: "/svg/Rectangle 130.svg",
    url: "/assistent/request/?query=and Ethical Hacking",
  },
  {
    name: "اینترنت اشیاء",
    icon: "/svg/Rectangle 131.svg",
    url: "/assistent/request/?query=Internet of Things",
  },
  {
    name: "اتوماسیون و اسکریپت نویسی",
    icon: "/svg/Rectangle 132.svg",
    url: "/assistent/request/?query=Automation and Scripting",
  },
  {
    name: "افزودن",
    icon: "/svg/Rectangle 125.svg",
    url: "/community/chat",
  },
];
const service_2 = [
  {
    name: "توسعه وب",
    icon: "/svg/Rectangle 125.svg",
    url: "/assistent/request/?query=Web Development",
  },
  {
    name: "اپلیکیشن موبایل",
    icon: "/svg/Rectangle 126.svg",
    url: "/assistent/request/?query=Mobile App",
  },
  {
    name: "نرم افزار ویندوز",
    icon: "/svg/Rectangle 127.svg",
    url: "/assistent/request/?query=Windows Software",
  },
  {
    name: "بازی سازی",
    icon: "/svg/Rectangle 128.svg",
    url: "/assistent/request/?query=Game Development",
  },
  {
    name: "داده هوش مصنوعی",
    icon: <DebugServiceIcon />,
    url: "/assistent/request/?query=AI Data",
  },
  {
    name: "بلاکچین،وب 3",
    icon: "/svg/Rectangle 129.svg",
    url: "/assistent/request/?query=Blockchain, Web 3",
  },
  {
    name: "امنیت و هک قانونمند",
    icon: "/svg/Rectangle 130.svg",
    url: "/assistent/request/?query=and Ethical Hacking",
  },
  {
    name: "اینترنت اشیاء",
    icon: "/svg/Rectangle 131.svg",
    url: "/assistent/request/?query=Internet of Things",
  }
];



export const data = [
    {
        title:"آموزش وب",
        icon:Home,
        url:""
    },
    {
        title:"آموزش پایتون",
        icon:Home,
        url:""
    },
    {
        title:"آموزش هوش مصنوعی",
        icon:Home,
        url:""
    },
    {
        title:"آموزش فیگما",
        icon:Home,
        url:""
    },
    {
        title:"ماشین لرنینگ",
        icon:Home,
        url:""
    },
    {
        title:"آموزش اندروید و IOS",
        icon:Home,
        url:""
    },
    {
        title:"اموزش وب سوکت",
        icon:Home,
        url:""
    },
]


const cards: CardItem[] = [
    {
      title: "علی محمدی",
      description: "متخصص دیباگ فرانت‌اند",
      src: "/files/1.jpg",
      ctaText: "مشاهده پروفایل",
      ctaLink: "https://example.com/profile",
      content:
        "علی محمدی با بیش از ۸ سال تجربه در زمینه دیباگ و رفع مشکلات فرانت‌اند، متخصص در فریم‌ورک‌های React، Vue و Angular است. او توانایی بالایی در شناسایی و رفع مشکلات پیچیده رندرینگ، بهینه‌سازی عملکرد و حل مسائل مربوط به رابط کاربری دارد.\n\nمهارت‌های کلیدی:\n• تسلط کامل بر ابزارهای دیباگ مرورگر (Chrome DevTools)\n• بهینه‌سازی عملکرد و حافظه در اپلیکیشن‌های SPA\n• رفع مشکلات مربوط به حالت (State) و چرخه حیات کامپوننت‌ها\n• تجربه عمیق در حل مشکلات سازگاری بین مرورگرها",
      url:"/community/chat/?uuid=dajdhaskdh"
      },
    {
      title: "سارا رضایی",
      description: "متخصص دیباگ بک‌اند",
      src: "/files/2.jpg",
      ctaText: "استخدام",
      ctaLink: "https://example.com/hire",
      content:
        "سارا رضایی متخصص در زمینه دیباگ سیستم‌های بک‌اند و پایگاه‌های داده است. با ۱۰ سال سابقه کار در شرکت‌های نرم‌افزاری بزرگ، او تخصص ویژه‌ای در شناسایی و رفع گلوگاه‌های عملکردی و مشکلات امنیتی دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ سیستم‌های Node.js، Django و Laravel\n• بهینه‌سازی کوئری‌های پایگاه داده\n• رفع نشتی‌های حافظه و مشکلات همزمانی\n• تجزیه و تحلیل لاگ‌ها و ردیابی خطاها در سیستم‌های توزیع شده",
        url:"/community/chat/?uuid=dajdhaskdh"
    
      },
    {
      title: "محمد حسینی",
      description: "متخصص دیباگ موبایل",
      src: "/files/1.jpg",
      ctaText: "مشاوره",
      ctaLink: "https://example.com/consult",
      content:
        "محمد حسینی با تخصص در دیباگ اپلیکیشن‌های موبایل، بیش از ۷ سال تجربه در حل مشکلات پیچیده در پلتفرم‌های Android و iOS دارد. او همچنین در زمینه فریم‌ورک‌های کراس پلتفرم مانند React Native و Flutter تخصص دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر ابزارهای دیباگ Android Studio و Xcode\n• رفع مشکلات مصرف باتری و بهینه‌سازی عملکرد\n• دیباگ مشکلات مربوط به چرخه حیات اپلیکیشن\n• تجربه در حل مشکلات سازگاری با نسخه‌های مختلف سیستم عامل",
        url:"/community/chat/?uuid=dajdhaskdh"
    
      },
    {
      title: "زهرا کریمی",
      description: "متخصص امنیت و دیباگ",
      src: "/files/1.jpg",
      ctaText: "همکاری",
      ctaLink: "https://example.com/collaborate",
      content:
        "زهرا کریمی متخصص در زمینه امنیت سایبری و دیباگ مشکلات امنیتی است. با بیش از ۹ سال تجربه در تست نفوذ و ارزیابی آسیب‌پذیری، او توانایی بالایی در شناسایی و رفع مشکلات امنیتی در سیستم‌های نرم‌افزاری دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر تکنیک‌های دیباگ کد برای یافتن آسیب‌پذیری‌های امنیتی\n• تجربه در رفع مشکلات XSS، SQL Injection و CSRF\n• تحلیل کد برای یافتن نقاط ضعف امنیتی\n• آشنایی با استانداردهای OWASP و روش‌های امن‌سازی کد",
        url:"/community/chat/?uuid=dajdhaskdh"
    
      },
    {
      title: "امیر جعفری",
      description: "متخصص دیباگ DevOps",
      src: "/files/2.jpg",
      ctaText: "تماس",
      ctaLink: "/community/chat",
      content:
        "امیر جعفری متخصص در زمینه دیباگ سیستم‌های DevOps و زیرساخت‌های ابری است. با ۱۱ سال تجربه در پیاده‌سازی و نگهداری سیستم‌های CI/CD، او مهارت بالایی در عیب‌یابی و رفع مشکلات در محیط‌های پیچیده دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ مشکلات Docker و Kubernetes\n• رفع مشکلات مربوط به پایپلاین‌های CI/CD\n• عیب‌یابی سیستم‌های توزیع شده و میکروسرویس‌ها\n• بهینه‌سازی عملکرد و مقیاس‌پذیری در محیط‌های ابری",
        url:"/community/chat/?uuid=dajdhaskdh"
    
      },
    {
      title: "نیلوفر احمدی",
      description: "متخصص دیباگ هوش مصنوعی",
      src: "/files/1.jpg",
      ctaText: "پروژه‌ها",
      ctaLink: "/community/chat",
      content:
        "نیلوفر احمدی متخصص در زمینه دیباگ سیستم‌های هوش مصنوعی و یادگیری ماشین است. با ۶ سال تجربه در توسعه و بهینه‌سازی مدل‌های یادگیری عمیق، او توانایی بالایی در شناسایی و رفع مشکلات در پروژه‌های هوش مصنوعی دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ مدل‌های یادگیری عمیق با TensorFlow و PyTorch\n• رفع مشکلات مربوط به همگرایی و بیش‌برازش مدل‌ها\n• بهینه‌سازی عملکرد و مصرف منابع در سیستم‌های ML\n• تجربه در دیباگ پایپلاین‌های پردازش داده برای هوش مصنوعی",
        url:"/community/chat/?uuid=dajdhaskdh"
    
      },
    {
      title: "رضا محسنی",
      description: "متخصص دیباگ بلاکچین",
      src: "/files/2.jpg",
      ctaText: "آموزش",
      ctaLink: "/community/chat",
  
      content:
        "رضا محسنی متخصص در زمینه دیباگ قراردادهای هوشمند و اپلیکیشن‌های بلاکچین است. با ۵ سال تجربه در توسعه و عیب‌یابی پروژه‌های مبتنی بر اتریوم و سایر پلتفرم‌های بلاکچین، او مهارت بالایی در شناسایی و رفع مشکلات امنیتی و عملکردی دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ قراردادهای هوشمند Solidity\n• تجربه در استفاده از ابزارهای Truffle و Hardhat برای دیباگ\n• شناسایی و رفع آسیب‌پذیری‌های امنیتی در قراردادهای هوشمند\n• بهینه‌سازی مصرف گس و عملکرد در اپلیکیشن‌های غیرمتمرکز",
        url:"/community/chat/?uuid=dajdhaskdh"
    
      },
    {
      title: "مریم صادقی",
      description: "متخصص دیباگ سیستم‌های تعبیه شده",
      src: "/files/1.jpg",
      ctaText: "رزومه",
      ctaLink: "/community/chat/?uuid='asdasd-asdsad'",
      content:
        "مریم صادقی متخصص در زمینه دیباگ سیستم‌های تعبیه شده (Embedded Systems) است. با ۱۲ سال تجربه در توسعه و عیب‌یابی نرم‌افزارهای سطح پایین، او مهارت بالایی در شناسایی و رفع مشکلات در سیستم‌های IoT و میکروکنترلرها دارد.\n\nمهارت‌های کلیدی:\n• تسلط بر دیباگ کد C/C++ برای سیستم‌های تعبیه شده\n• تجربه در استفاده از دیباگرهای سخت‌افزاری و JTAG\n• عیب‌یابی مشکلات مربوط به زمان‌بندی و وقفه‌ها\n• بهینه‌سازی مصرف انرژی و عملکرد در سیستم‌های با منابع محدود",
        url:"/community/chat/?uuid=dajdhaskdh"
    
      },
  ];


const classInfoTitle = ()=> {
    return <h2 className='text-center text-xl'>کلاس های خصوصی پر مخاطب</h2>
}

const page = () => {
  return (
    <main>
        <div className="relative">
        <Hero
          header="آموزش فوری با اولین کلیک"
          button_title="شروع آموزش فوری"
          url="/community/chat"
          description=" برای شروع یادگیری حوزه مورد نظرت رو انتخاب  کن"
          description_2=" بقیه شو به دیباگچی بسپار"
        />
        <HeroService data={HeroServiceName} />
      </div>
      <section
      className="max-w-7xl mx-auto min-h-[400px] mt-[212px]"
      id="service"
    >
        <Services data={service} title='موضوعات پیشنهادی' title_placement='justify-start'/>
   </section>

    <ClassInfo data={data} title={"کلاس های خصوصی پر"} highlight='مخاطب'  />

      <section
      className="max-w-7xl mx-auto min-h-[400px] mt-[212px]"
      id="service"
    >
        <Services data={service_2} title='موضوعات پردآمد' title_placement='justify-start'/>
   </section>
    <OnlineDebugers data={cards} button_title='درخواست کلاس خوصوصی'/>
    </main>
  )
}

export default page