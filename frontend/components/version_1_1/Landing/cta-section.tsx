"use client";
import {
  Calendar,
  RefreshCcw,
  ShoppingBag,
  Globe,
  Percent,
  Cloud,
  PiggyBank,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function ServiceFeatures() {
  const features = [
    {
      icon: Calendar,
      title: "آموزش رایگان",
      description: "پرداخت‌های منظم از طریق اشتراک دریافت کنید",
      href: "/community?type=free courses",
    },
    {
      icon: RefreshCcw,
      title: "دریافت سریع دیباگ",
      description: "بازپرداخت‌های کامل و جزئی را به‌سادگی انجام دهید",
      href: "/",
    },
    {
      icon: ShoppingBag,
      title: "مشاهده مدرسان دیباگچی",
      description: "پیشنهاد ویژه برای کسب‌وکارهای خرده‌فروشی",
      href: "/community?type=users",
    },
    {
      icon: Globe,
      title: "نیاز به کلاس خصوصی دارم",
      description: "پرداخت‌ها را از ۲۱۸ کشور بپذیرید",
      href: "/",
    },
    {
      icon: Cloud,
      title: "دریافت مشاوره فوری",
      description: "پرداخت‌های آنلاین را مطابق با قوانین انجام دهید",
      href: "/",
    },
    {
      icon: PiggyBank,
      title: "شرکت در مزایده و مناقصه",
      description: "تعرفه‌های انعطاف‌پذیر: حجم تراکنش بیشتر، کمیسیون کمتر",
      href: "/bid",
    },
  ];

  return (
    <div className="w-full bg-pink-50 dark:bg-slate-900 py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden rounded-t-[100px] mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            ما سرویسی ایجاد کرده‌ایم که تمام نیازها را پوشش می‌دهد
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            از آموزش تا دیباگینگ برای پیشرفت شما
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} className="w-auto h-auto">
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-950 rounded-2xl p-6 flex flex-col items-center text-center shadow-md  shadow-pink-100 dark:shadow-slate-800 transition-transform duration-300 ease-in-out hover:shadow-lg hover:shadow-pink-200 dark:hover:shadow-slate-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 rounded-full bg-purple-400 dark:bg-purple-950 flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
