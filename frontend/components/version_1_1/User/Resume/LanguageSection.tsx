"use client"

import type { UserLanguage } from "@/components/types/user.types"
import { Card, CardBody, CardHeader, Chip } from "@heroui/react"
import { Sparkle } from "lucide-react"
import { useMemo } from "react"

type Props = {}

const LanguageSection = ({
  debugger_bio,
  languages,
}: {
  debugger_bio: string
  languages: UserLanguage[]
}) => {
  // Define base position classes for the scattered layout
  const basePositions = [
    "top-[20%] right-[10%]",
    "top-[35%] right-[30%]",
    "top-[60%] right-[15%]",
    "top-[45%] right-[50%]",
    "top-[25%] right-[65%]",
    "top-[55%] right-[70%]",
    "top-[70%] right-[40%]",
    "top-[15%] right-[40%]",
    "top-[40%] right-[5%]",
    "top-[65%] right-[60%]",
  ]

  // Generate random translations for each language
  // Using useMemo to ensure consistent random values between renders
  const chipStyles = useMemo(() => {
    return languages.map((_, index) => {
      // Use a seeded random approach based on index
      // This creates a pseudo-random effect that's consistent between renders
      const seed = index * 9973 // Using a prime number as multiplier

      // Generate random translations within a controlled range
      // The modulo operations ensure values stay within desired bounds
      const translateX = ((seed % 17) - 8) * 3 // Range: -24px to +24px
      const translateY = ((seed % 13) - 6) * 3 // Range: -18px to +18px

      // Generate random rotation for added visual interest
      const rotate = ((seed % 11) - 5) * 2 // Range: -10deg to +10deg

      return {
        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
      }
    })
  }, [languages.length])

  return (
    <div className="grid grid-cols-2 gap-4 w-3/4 ">
      <div className=" flex flex-col ">
        <Card>
          <CardHeader className="bg-c_background/50">
            <Chip color="secondary" variant="light" className="bg-black/40 text-tiny p-4">
              زبان های برنامه نویسی
            </Chip>
          </CardHeader>
          <CardBody className="box-border p-5 bg-c_background/50">
            <div className="flex gap-4 flex-col w-full min-h-[300px] bg-[#140b1b] box-border p-5 rounded-xl">
              <div className="w-full flex gap-4 box-border px-10">
                <span>علاقه مند به</span>
                <span>
                  <Sparkle className="stroke-amber-400" />
                </span>
              </div>
              <div className="relative w-full h-full min-h-[220px]">
                {languages.map((item, index) => {
                  // Use modulo to cycle through positions if there are more languages than positions
                  const positionClass = basePositions[index % basePositions.length]

                  return (
                    <div
                      key={item.language_name.id}
                      className={`absolute ${positionClass} transition-all duration-300 hover:scale-110 hover:z-20`}
                      style={chipStyles[index]}
                    >
                      <Chip className="border-b-2 shadow-lg cursor-pointer" color="secondary" variant="solid">
                        {item.language_name.name} {item.language_name.level}
                      </Chip>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="flex flex-col items-start ">
        <Card>
          <CardHeader className="bg-c_background/50">
            <Chip color="secondary" variant="light" className="bg-black/40 text-tiny p-4">
              درباره من
            </Chip>
          </CardHeader>
          <CardBody className="box-border p-5 bg-c_background/50">
            <div className="flex gap-4 flex-col w-full min-h-[300px] bg-[#140b1b] box-border p-5 rounded-xl">
              <p className="text-justify leading-10">{debugger_bio}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default LanguageSection
