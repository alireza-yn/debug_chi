"use client"
import { useEffect, useState } from "react"
import { I18nProvider, useDateFormatter } from "@react-aria/i18n"
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NumberInput,
  Spinner,
  TimeInput,
} from "@heroui/react"
import type { Main as User } from "@/components/types/user.types"
import { CheckCircle, ChevronDown, ChevronUp, Clock, PhoneCall, ShieldAlert, Video } from "lucide-react"
import { CalendarDate, getLocalTimeZone, Time, today } from "@internationalized/date"
import { formatCurrency } from "@/utils/tools"
import { useAppDispatch } from "@/redux/store/store"
import { setMessage } from "@/redux/slices/chatSocketSlice"
import { socket } from "@/config/socket-config"

interface EditedRequest {
  debug: {
    is_chat: boolean
    is_voice: boolean
    is_video: boolean
    session_number?: number
    session_time?: number
    session_hours?: number
    session_minutes?: number
  }
  moshaver: {
    is_chat: boolean
    is_voice: boolean
    is_video: boolean
    session_number?: number
    session_time?: number
    session_hours?: number
    session_minutes?: number
  }
  class: {
    session_number: number
    session_time: number
    session_hours?: number
    session_minutes?: number
  }
  date: string
}

export const UserCard = ({ user, data }: { user: User; data: any }) => {
    console.log(data)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const _time = new Date()
  const [edited_request, setRequest] = useState<EditedRequest>({
    moshaver: {
      is_chat: false,
      is_video: false,
      is_voice: false,
      session_hours: 1,
      session_minutes: 0,
    },
    debug: {
      is_chat: false,
      is_video: false,
      is_voice: false,
      session_hours: 1,
      session_minutes: 0,
    },
    class: {
      session_number: 0,
      session_time: 0,
      session_hours: 1,
      session_minutes: 0,
    },
    date: _time.toString(),
  })

  const [selectedDate, setSelectedDate] = useState<CalendarDate>(today(getLocalTimeZone()))
  const [selectedTime, setSelectedTime] = useState<Time>(new Time(_time.getHours(), _time.getMinutes(), 0))
  const dispatch = useAppDispatch()
  const dateFormatter = useDateFormatter({ dateStyle: "full" })
  const timeFormatter = useDateFormatter({ timeStyle: "short" })

  const handleEditRequest = (
    action: string,
    value?: boolean | CalendarDate | Time | number,
    session_number?: number,
  ) => {
    if (action === "debug_voice") {
      setRequest((prev) => ({
        ...prev,
        debug: { ...prev.debug, is_voice: !prev.debug.is_voice },
      }))
    }
    if (action === "debug_video") {
      setRequest((prev) => ({
        ...prev,
        debug: { ...prev.debug, is_video: !prev.debug.is_video },
      }))
    }
    if (action === "moshaver_voice") {
      setRequest((prev) => ({
        ...prev,
        moshaver: { ...prev.moshaver, is_voice: !prev.moshaver.is_voice },
      }))
    }
    if (action === "moshaver_video") {
      setRequest((prev) => ({
        ...prev,
        moshaver: { ...prev.moshaver, is_video: !prev.moshaver.is_video },
      }))
    }

    if (action === "date" && value instanceof CalendarDate) {
      setSelectedDate(value)
      updateDateTime(value, selectedTime)
    }

    if (action === "time" && value instanceof Time) {
      setSelectedTime(value)
      updateDateTime(selectedDate, value)
    }
    if (action === "set_debug_session" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        debug: { ...prev.debug, session_number: value },
      }))
    }
    if (action === "set_debug_time" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        debug: { ...prev.debug, session_time: value },
      }))
    }
    if (action === "set_moshaver_session" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        moshaver: { ...prev.moshaver, session_number: value },
      }))
    }
    if (action === "set_moshaver_time" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        moshaver: { ...prev.moshaver, session_time: value },
      }))
    }
    if (action === "set_class_session" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        class: { ...prev.class, session_number: value },
      }))
    }
    if (action === "set_class_time" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        class: { ...prev.class, session_time: value },
      }))
    }

    if (action === "set_debug_hours" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        debug: { ...prev.debug, session_hours: value },
      }))
    }
    if (action === "set_debug_minutes" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        debug: { ...prev.debug, session_minutes: value },
      }))
    }
    if (action === "set_moshaver_hours" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        moshaver: { ...prev.moshaver, session_hours: value },
      }))
    }
    if (action === "set_moshaver_minutes" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        moshaver: { ...prev.moshaver, session_minutes: value },
      }))
    }
    if (action === "set_class_hours" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        class: { ...prev.class, session_hours: value },
      }))
    }
    if (action === "set_class_minutes" && typeof value === "number") {
      setRequest((prev) => ({
        ...prev,
        class: { ...prev.class, session_minutes: value },
      }))
    }

  }

  const updateDateTime = (date: CalendarDate, time: Time) => {
    try {
      const dateTime = date.toDate(getLocalTimeZone())
      dateTime.setHours(time.hour)
      dateTime.setMinutes(time.minute)

      const formattedDateTime = `${dateFormatter.format(dateTime)} ${timeFormatter.format(dateTime)}`

      setRequest((prev) => ({
        ...prev,
        date: formattedDateTime,
        time: timeFormatter.format(dateTime),
      }))
    } catch (error) {
      console.error("Error updating date and time:", error)
    }
  }



  const sendMessage = () => {

      const _data = {
        session_id:data.session_id,
        sender: data.debuger.uuid || data.consult.uuid,
        receiver: data.debuger_applicator.uuid || data.consult_applicator.uuid ,
        data: {
          type:"payment",
          data: edited_request,
          created_at: String(new Date()),
          status:"pending",
        }
      }
      
      dispatch(setMessage(_data))
      socket.emit("test_message", _data );
  };





  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center box-border p-4 min-h-[400px] bg-default/80 rounded-3xl">
        <Spinner classNames={{ label: "text-foreground mt-4" }} label="منتظر بمانید" variant="spinner" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 items-center box-border p-4 min-h-[400px] bg-default/80 rounded-3xl">
      <img
        src={user.image_profile != null ? `${process.env.server}/${user.image_profile}` : "/user.jpg"}
        className="w-10 h-10 rounded-full"
      />
      <div className="w-full flex flex-col items-center">
        <span>{user.first_name + " " + user.last_name}</span>
      </div>
      <div className="flex-1 w-full">
        <Card className="w-full" dir="rtl">
          <CardHeader className="w-full text-medium">{data.title}</CardHeader>
          <CardBody className="flex flex-col font-lightSans gap-3" dir="ltr">
            <p className="text-sm">{data.description}</p>
            <div className="w-full flex flex-row-reverse justify-between">
              <Chip radius="sm" className="w-48 h-10 !font-mediumSans" size="lg" variant="shadow" color="success">
                {formatCurrency(data.price)}
              </Chip>
              <Dropdown
                isKeyboardDismissDisabled
                className="w-96 ml-28 bg-default-100"
                placement="bottom"
                closeOnSelect={false}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
              >
                <DropdownTrigger>
                  <Button variant="solid" color="default" endContent={isOpen ? <ChevronUp /> : <ChevronDown />}>
                    ست کردن خدمات
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem variant="light" key="copy" dir="rtl">
                    <Accordion variant="splitted">
                      <AccordionItem key="1" aria-label="Accordion 1" title="دیباگ">
                        <div className="flex gap-2 ">
                          <Checkbox
                            isSelected={edited_request.debug.is_voice}
                            onChange={() => handleEditRequest("debug_voice")}
                          >
                            تماس صوتی
                          </Checkbox>
                          <Checkbox
                            isSelected={edited_request.debug.is_video}
                            onChange={() => handleEditRequest("debug_video")}
                          >
                            تماس ویدیویی
                          </Checkbox>
                        </div>
                        <div className="h-4 w-full"></div>
                        <NumberInput
                          minValue={0}
                          defaultValue={0}
                          label="تعداد جلسات"
                          labelPlacement="outside"
                          onValueChange={(value) => handleEditRequest("set_debug_session", value)}
                        />
                        <div className="flex gap-2 items-center">
                          <NumberInput
                            minValue={0}
                            maxValue={24}
                            defaultValue={1}
                            label="ساعت"
                            labelPlacement="outside"
                            className="flex-1"
                            onValueChange={(value) => handleEditRequest("set_debug_hours", value)}
                          />
                          <NumberInput
                            minValue={0}
                            maxValue={59}
                            defaultValue={0}
                            label="دقیقه"
                            labelPlacement="outside"
                            className="flex-1"
                            onValueChange={(value) => handleEditRequest("set_debug_minutes", value)}
                          />
                        </div>
                      </AccordionItem>
                      <AccordionItem key="2" aria-label="Accordion 2" title="مشاوره">
                        <div className="flex gap-2 mb-2">
                          <Checkbox
                            isSelected={edited_request.moshaver.is_voice}
                            onChange={() => handleEditRequest("moshaver_voice")}
                          >
                            تماس صوتی
                          </Checkbox>

                          <Checkbox
                            isSelected={edited_request.moshaver.is_video}
                            onChange={() => handleEditRequest("moshaver_video")}
                          >
                            تماس ویدیویی
                          </Checkbox>
                        </div>
                        <div className="h-4 w-full"></div>

                        <NumberInput
                          minValue={0}
                          defaultValue={0}
                          label="تعداد جلسات"
                          labelPlacement="outside"
                          onValueChange={(value) => handleEditRequest("set_moshaver_session", value)}
                        />
                        <div className="flex gap-2 items-center">
                          <NumberInput
                            minValue={0}
                            max={24}
                            defaultValue={1}
                            label="ساعت"
                            labelPlacement="outside"
                            className="flex-1"
                            onValueChange={(value) => handleEditRequest("set_moshaver_hours", value)}
                          />
                          <NumberInput
                            minValue={0}
                            max={59}
                            defaultValue={0}
                            label="دقیقه"
                            labelPlacement="outside"
                            className="flex-1"
                            onValueChange={(value) => handleEditRequest("set_moshaver_minutes", value)}
                          />
                        </div>
                      </AccordionItem>
                      <AccordionItem key="3" aria-label="Accordion 3" title="برگزاری کلاس">
                        <NumberInput
                          minValue={0}
                          defaultValue={0}
                          label="تعداد جلسات"
                          labelPlacement="outside"
                          onValueChange={(value) => handleEditRequest("set_class_session", value)}
                        />
                        <div className="flex gap-2 items-center">
                          <NumberInput
                            minValue={0}
                            maxValue={24}
                            defaultValue={1}
                            label="ساعت"
                            labelPlacement="outside"
                            className="flex-1"
                            onValueChange={(value) => handleEditRequest("set_class_hours", value)}
                          />
                          <NumberInput
                            minValue={0}
                            maxValue={59}
                            defaultValue={0}
                            label="دقیقه"
                            labelPlacement="outside"
                            className="flex-1"
                            onValueChange={(value) => handleEditRequest("set_class_minutes", value)}
                          />
                        </div>

                        {/* می‌تونی اینجا چک‌باکس‌های مخصوص کلاس یا ورودی عددی اضافه کنی */}
                      </AccordionItem>
                    </Accordion>
                  </DropdownItem>

                  <DropdownItem key="time" variant="light">
                    <I18nProvider locale="fa-IR">
                      <div className="flex flex-col gap-2 ">
                        <DatePicker
                          hideTimeZone
                          showMonthAndYearPickers
                          aria-label="تاریخ جلسه"
                          defaultValue={selectedDate}
                          onChange={(date) => {
                            if (date) {
                              handleEditRequest("date", date)
                            }
                          }}
                          label="تاریخ جلسه"
                          variant="flat"
                          color="default"
                        />

                        <TimeInput
                          label="زمان جلسه"
                          defaultValue={selectedTime}
                          onChange={(time) => {
                            if (time) {
                              handleEditRequest("time", time)
                            }
                          }}
                          variant="flat"
                          color="default"
                        />
                      </div>
                    </I18nProvider>
                  </DropdownItem>
                  <DropdownItem key={"submit"} variant="light">
                    <Button
                      color="success"
                      variant="solid"
                      fullWidth
                      onPress={() => {
                        console.log("Full date and time:", edited_request)
                        setIsEdited(true);
                        setIsOpen(false);
                        sendMessage();
                        // Close the dropdown
                      }}
                    >
                      ست کردن
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            {isEdited && (
              <div className="mt-3 p-3 bg-success-50 rounded-lg w-full">
                <h4 className="text-sm font-bold mb-2">جزئیات انتخاب شده:</h4>
                <div className="flex flex-col gap-1 text-xs">
                  {edited_request.debug.is_voice && (
                    <div className="flex items-center gap-1">
                      <PhoneCall size={14} />
                      <span>تماس صوتی (دیباگ)</span>
                    </div>
                  )}
                  {edited_request.debug.is_video && (
                    <div className="flex items-center gap-1">
                      <Video size={14} />
                      <span>تماس ویدیویی (دیباگ)</span>
                    </div>
                  )}
                  {edited_request.moshaver.is_voice && (
                    <div className="flex items-center gap-1">
                      <PhoneCall size={14} />
                      <span>تماس صوتی (مشاوره)</span>
                    </div>
                  )}
                  {edited_request.moshaver.is_video && (
                    <div className="flex items-center gap-1">
                      <Video size={14} />
                      <span>تماس ویدیویی (مشاوره)</span>
                    </div>
                  )}
                  {edited_request.debug.session_number && (
                    <div className="text-xs">
                      دیباگ: {edited_request.debug.session_number} جلسه، هر جلسه {edited_request.debug.session_hours}{" "}
                      ساعت و {edited_request.debug.session_minutes} دقیقه
                    </div>
                  )}
                  {edited_request.moshaver.session_number && (
                    <div className="text-xs">
                      مشاوره: {edited_request.moshaver.session_number} جلسه، هر جلسه{" "}
                      {edited_request.moshaver.session_hours} ساعت و {edited_request.moshaver.session_minutes} دقیقه
                    </div>
                  )}
                  {edited_request.class.session_number && (
                    <div className="text-xs">
                      کلاس: {edited_request.class.session_number} جلسه، هر جلسه {edited_request.class.session_hours}{" "}
                      ساعت و {edited_request.class.session_minutes} دقیقه
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>
                      {new Date(edited_request.date).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}{" "}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
          <CardFooter className="w-full flex items-center gap-2">
            <Button fullWidth variant="faded" color="danger" endContent={<ShieldAlert size={14} />}>
              لغو
            </Button>

            <Button fullWidth color="success" endContent={<CheckCircle size={14} />}>
              {isEdited ? "اعمال تغییر" : "انجام میدم"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
