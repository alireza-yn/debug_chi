"use client"

import type { UserLanguage } from "@/components/types/user.types"
import { perform_post } from "@/lib/api"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Checkbox,
  useDisclosure,
} from "@heroui/react"
import axios from "axios"
import { Plus, Search, Sparkle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import Cookies from "js-cookie"
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
    "top-[40%] right-[30%]",
    "top-[65%] right-[15%]",
    "top-[50%] right-[50%]",
    "top-[30%] right-[65%]",
    "top-[60%] right-[70%]",
    "top-[75%] right-[40%]",
    "top-[20%] right-[40%]",
    "top-[45%] right-[5%]",
    "top-[70%] right-[60%]",
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
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-white"></div>
        <h3 className="text-3xl font-bold bg-gradient-to-r to-violet-500 from-white bg-clip-text text-transparent">
          زبان های برنامه نویسی که آشنایی دارم و توضیحات تکمیلی
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 w-3/4">
        <div className="flex flex-col">
          <Card className="border-2 border-violet-900">
            <CardHeader className="bg-c_background/50 flex justify-between">
              <Chip color="secondary" variant="light" className="bg-black/40 text-tiny p-4">
                زبان های برنامه نویسی
              </Chip>
              <EditLanguageModal />
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

                    // Fix: Generate a unique key using index if id is not available
                    const uniqueKey = item.language_name?.id || `lang-${index}`

                    return (
                      <div
                        key={uniqueKey}
                        className={`absolute ${positionClass} transition-all duration-300 hover:scale-110 hover:z-20`}
                        style={chipStyles[index]}
                      >
                        <Chip className="border-b-2 shadow-lg cursor-pointer" color="secondary" variant="solid">
                          {item.language_name?.name} {item.language_name?.level}
                        </Chip>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col items-start">
          <Card className="border-2 border-violet-900">
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
    </div>
  )
}

export default LanguageSection

// Modal component for editing languages
interface EditLanguageModalProps {
  initialSelectedLanguages?: any[]
  onSave?: (languages: any[]) => void
}

const EditLanguageModal = ({ initialSelectedLanguages = [], onSave }: EditLanguageModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState<any[]>(initialSelectedLanguages)
  const [languages, setLanguages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/programming-languages/")

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setLanguages(data)
      } catch (err) {
        console.error("Failed to fetch programming languages:", err)
        setError("Failed to load programming languages. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch when modal opens
    if (isOpen) {
      fetchLanguages()
    }
  }, [isOpen])

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    return languages.filter((lang) => lang.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [languages, searchQuery])

  // Check if a language is already selected
  const isLanguageSelected = (id: string) => {
    return selectedLanguages.some((lang) => lang.id === id)
  }

  // Toggle language selection
  const toggleLanguage = (language: {
    id: string
    name: string
    level: string
  }) => {
    if (isLanguageSelected(language.id)) {
      setSelectedLanguages(selectedLanguages.filter((lang) => lang.id !== language.id))
    } else {
      setSelectedLanguages([
        ...selectedLanguages,
        {
          id: language.id,
          language_name: {
            id: language.id,
            name: language.name,
            level: language.level,
          },
        },
      ])
    }
  }

  const removeLanguage = (id: string) => {
    setSelectedLanguages(selectedLanguages.filter((lang) => lang.id !== id))
  }



  const postLanguage = async (item:any, token:any) => {
    return axios.post('http://localhost:8000/api/v1/add_language/', {
      language_id: item.id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  };
  

  const handleSave = async () => {
    const token = Cookies.get('token');
  
    for (const item of selectedLanguages) {
      try {
        const response = await postLanguage(item, token);
        console.log("Posted:", response.data);
      } catch (error) {
        console.error("Error posting language:", item.id, error);
      }
    }
  
    if (onSave){

      onSave(selectedLanguages);
    } 
    onOpenChange()
    
  };

  return (
    <>
      <Button startContent={<Plus size={14} />} variant="light" color="secondary" onPress={onOpen}>
        ویرایش زبان ها
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">ویرایش زبان های برنامه نویسی</ModalHeader>

              <ModalBody>
                <div className="flex flex-col gap-4">
                  {/* Search input */}
                  <Input
                    placeholder="جستجوی زبان برنامه نویسی..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    startContent={<Search size={16} />}
                    onClear={() => setSearchQuery("")}
                  />

                  {/* Selected languages chips */}
                  {selectedLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-700 rounded-lg bg-[#1a0f24]">
                      {selectedLanguages.map((lang) => (
                        <Chip
                          key={lang.id || `selected-${lang.language_name?.name}`}
                          onClose={() => removeLanguage(lang.id)}
                          variant="flat"
                          color="secondary"
                          className="transition-all hover:scale-105"
                        >
                          {lang.language_name?.name} {lang.language_name?.level && `(${lang.language_name.level})`}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {/* Languages list */}
                  <ScrollShadow className="h-[300px]">
                    <div className="flex flex-col gap-2">
                      {isLoading ? (
                        <div className="text-center p-4">در حال بارگذاری...</div>
                      ) : error ? (
                        <div className="text-center p-4 text-red-500">{error}</div>
                      ) : filteredLanguages.length > 0 ? (
                        filteredLanguages.map((language) => (
                          <div
                            key={language.id}
                            className={`
                              flex items-center justify-between p-3 rounded-lg cursor-pointer
                              ${
                                isLanguageSelected(String(language.id))
                                  ? "bg-secondary/20"
                                  : "bg-[#140b1b] hover:bg-[#1a0f24]"
                              }
                              transition-all duration-200
                            `}
                            onClick={() =>
                              toggleLanguage({
                                id: String(language.id),
                                level: language.level,
                                name: language.name,
                              })
                            }
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                isSelected={isLanguageSelected(String(language.id))}
                                color="secondary"
                                onChange={() =>
                                  toggleLanguage({
                                    id: String(language.id),
                                    level: language.level,
                                    name: language.name,
                                  })
                                }
                              />
                              <span>{language.name}</span>
                            </div>
                            <Chip size="sm" variant="flat" color="secondary">
                              {language.level}
                            </Chip>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 text-gray-400">زبان برنامه نویسی مورد نظر یافت نشد</div>
                      )}
                    </div>
                  </ScrollShadow>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  انصراف
                </Button>
                <Button color="secondary" onPress={handleSave}>
                  ذخیره تغییرات
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
