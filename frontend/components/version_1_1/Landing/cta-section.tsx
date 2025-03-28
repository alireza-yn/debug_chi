"use client";
import { Calendar, RefreshCcw, ShoppingBag, Globe, Percent, Cloud, PiggyBank, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export function ServiceFeatures() {
  const features = [
    {
      icon: Calendar,
      title: "پرداخت‌های دوره‌ای",
      description: "پرداخت‌های منظم از طریق اشتراک دریافت کنید",
    },
    {
      icon: RefreshCcw,
      title: "بازپرداخت‌ها",
      description: "بازپرداخت‌های کامل و جزئی را به‌سادگی انجام دهید",
    },
    {
      icon: ShoppingBag,
      title: "برای فروشگاه‌های اینترنتی",
      description: "پیشنهاد ویژه برای کسب‌وکارهای خرده‌فروشی",
    },
    {
      icon: Globe,
      title: "در سراسر جهان",
      description: "پرداخت‌ها را از ۲۱۸ کشور بپذیرید",
    },
    {
      icon: Percent,
      title: "اقساط و وام‌ها",
      description: "۷ بانک همکار درخواست‌های شما را بررسی می‌کنند",
    },
    {
      icon: Cloud,
      title: "صندوق ابری",
      description: "پرداخت‌های آنلاین را مطابق با قوانین انجام دهید",
    },
    {
      icon: PiggyBank,
      title: "کمیسیون کمتر",
      description: "تعرفه‌های انعطاف‌پذیر: حجم تراکنش بیشتر، کمیسیون کمتر",
    },
    {
      icon: Smartphone,
      title: "اپلیکیشن اختصاصی",
      description: "اپلیکیشن راحت برای iOS و Android",
    },
  ];

  return (
    <div className="w-full bg-pink-50 py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden rounded-t-[100px] mt-20">
      {/* نوارهای رنگی کناری */}
      {/* <div className="absolute left-0 top-0 w-[5%] h-full bg-purple-400"></div>
      <div className="absolute right-0 top-0 w-[5%] h-full bg-pink-300"></div> */}

      <div className="max-w-6xl mx-auto">
        {/* عنوان */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            ما سرویسی ایجاد کرده‌ایم که تمام نیازها را پوشش می‌دهد
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            از پرداخت‌های ساده تا اتصال به وام و اقساط
          </p>
        </div>

        {/* گرید ویژگی‌ها */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-md  shadow-pink-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-400 flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
