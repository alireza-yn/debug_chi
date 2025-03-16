"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function CtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-16 md:py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2 text-right order-2 md:order-1"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">
                همین حالا پیشرفت کسب‌وکار خود را آغاز کنید
              </h2>
              <p className="text-gray-700 mb-8">
                با استفاده از سیستم مدیریت ما، به راحتی می‌توانید فرآیندهای کسب و کار خود را بهینه‌سازی کنید و به رشد
                پایدار دست یابید.
              </p>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ثبت‌نام
              </motion.button>
            </motion.div>

            <motion.div
              className="md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=350&width=400"
                  alt="مشاور کسب و کار"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

