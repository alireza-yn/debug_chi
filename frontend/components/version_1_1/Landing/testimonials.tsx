"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerSlide, setItemsPerSlide] = useState(1)

  const testimonials = [
    {
      name: "علی رضایی",
      role: "مدیر عامل شرکت آلفا",
      image: "/placeholder.svg?height=100&width=100",
      text: "این سیستم کار ما را آسان‌تر کرد. پس از استفاده از این سیستم، بهره‌وری تیم ما به میزان قابل توجهی افزایش یافت.",
    },
    {
      name: "مریم محمدی",
      role: "مدیر بازاریابی",
      image: "/placeholder.svg?height=100&width=100",
      text: "رابط کاربری بسیار ساده و کاربردی دارد. به راحتی می‌توانیم گزارش‌های مورد نیاز را استخراج کنیم.",
    },
    {
      name: "سعید کریمی",
      role: "مدیر فروش",
      image: "/placeholder.svg?height=100&width=100",
      text: "پشتیبانی فوق‌العاده و پاسخگویی سریع به سوالات. قطعاً این سیستم را به دیگران هم پیشنهاد می‌کنم.",
    },
    {
      name: "نیلوفر احمدی",
      role: "مدیر منابع انسانی",
      image: "/placeholder.svg?height=100&width=100",
      text: "مدیریت کارکنان با این سیستم بسیار ساده شده است. امکانات متنوعی برای پیگیری عملکرد تیم دارد.",
    },
  ]

  useEffect(() => {
    const updateItemsPerSlide = () => {
      setItemsPerSlide(window.innerWidth >= 768 ? 2 : 1)
    }
    updateItemsPerSlide()
    window.addEventListener("resize", updateItemsPerSlide)
    return () => window.removeEventListener("resize", updateItemsPerSlide)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-gradient-to-t from-gray-100 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100" ref={ref} dir="ltr">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-700 bg-clip-text text-transparent dark:from-purple-300 dark:to-indigo-400">
            نظرات مشتریان ما
          </h2>
          <p className="text-gray-100 max-w-2xl mx-auto">آنچه مشتریان ما درباره خدمات و محصولات ما می‌گویند</p>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full md:w-1/2 flex-shrink-0 px-4">
                <div className="bg-purple-100 dark:bg-purple-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-right h-full flex flex-col">
                  <p className="text-gray-900 dark:text-gray-200 mb-6 flex-grow">{testimonial.text}</p>
                  <div className="flex items-center justify-end">
                    <div className="mr-4">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                    </div>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <motion.button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-purple-300 dark:bg-purple-700 shadow-md hover:bg-purple-400 dark:hover:bg-purple-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-purple-300 dark:bg-purple-700 shadow-md hover:bg-purple-400 dark:hover:bg-purple-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {testimonials.map((_, index) => (
            <span key={index} className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-purple-500 dark:bg-purple-300" : "bg-gray-400 dark:bg-gray-500"}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
