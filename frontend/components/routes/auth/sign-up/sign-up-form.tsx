"use client"

import React, { useEffect, useState, type FormEvent } from "react"
import { Form, Divider, InputOtp } from "@heroui/react"
import { LogoIcon } from "@/components/ui/icons"
import { perform_post } from "@/lib/api"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"
import { type RootState, useAppDispatch, useAppSelector } from "@/redux/store/store"
import { setPath, showLogin } from "@/redux/slices/globalSlice"
import Inputs from "@/components/version_1_1/ui/input"
import Button from "@/components/version_1_1/ui/button"

type Props = {
  switchToLogin: () => void
}

export default function SignUpForm({ switchToLogin }: Props) {
  const dispatch = useAppDispatch()
  const { path } = useAppSelector((state: RootState) => state.gloabal)
  const [show, setOtp] = React.useState(false)
  const [phone, setPhone] = React.useState<any>("")
  const [request, setRequest] = React.useState(false)
  const currnt_path = usePathname()
  const [url, setUrl] = useState<string>("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [message, setMessage] = React.useState({
    user_phone: "",
  })


  useEffect(() => {
    const type = localStorage.getItem('type')
    if (type == "specialist") {
      setUrl("auths/register_debuger/")
    } else {
      setUrl('auths/user_register/')
    }
  }, [])

  const registerHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const data = Object.fromEntries(new FormData(e.currentTarget))

    const response = await perform_post(url, data)
    console.log(response)
    if (response.success) {
      setOtp(true)
      setIsLoading(false)
      setPhone(data.user_phone)
      setMessage({ user_phone: "" })
    }
    if (response.status === 400) {
      setMessage((prev) => ({
        ...prev,
        user_phone: response.data.user_phone?.[0] || "",
      }))
    }
  }

  const verifyHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const response = await perform_post("auths/verify_otp/", data)
    if (response.user_intro === false) {
      dispatch(setPath("/intro/programmer introduction"))
    }
    if (response.success) {
      Cookies.set("token", response.access)
      localStorage.setItem("user_data", JSON.stringify(response.data))
      window.location.href = path || ""
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 bg-background rounded-lg shadow-md">
      <Form
        className={`w-full max-w-md sm::scale-50 ${show ? "hidden" : "flex"} flex-col gap-3 sm:gap-4 items-center`}
        onSubmit={registerHandler}
      >
        <div className="mb-2 sm:mb-4">
          <LogoIcon />
        </div>

        <Inputs
          size="lg"
          isRequired
          errorMessage={message.user_phone || ""}
          label="شماره تلفن"
          name="user_phone"
          placeholder="09xxxxxxxxx"
          type="text"
          validate={(value) => {
            if (value.length > 11 || value.length < 11) {
              return "شماره تلفن وارد شده صحیح نیست"
            } else if (!value.startsWith("09", 0)) {
              return "شماره تلفن وارد شده صحیح نیست"
            }
          }}
        />

        <div className="flex w-full gap-2 sm:gap-4 flex-col sm:flex-row">
          <Inputs
            size="lg"
            isRequired
            errorMessage="نام خود را وارد نمایید"
            label="نام"
            name="first_name"
            placeholder="جان"
            type="text"
          />
          <Inputs
            size="lg"
            isRequired
            errorMessage="نام خانوادگی را وارد نمایید"
            label="نام خانودگی"
            name="last_name"
            placeholder="دو"
            type="text"
          />
        </div>

        <Inputs
          size="lg"
          isRequired
          errorMessage="ایمیل صحیح وارد نمایید"
          label="ایمیل"
          name="email"
          placeholder="abc@gmail.com"
          type="email"
        />

        <Inputs
          size="lg"
          isRequired
          errorMessage="نام کاربری صحیح نمی باشد"
          label="نام کاربری"
          name="username"
          placeholder="HelloWorld"
          type="text"
        />

        <Inputs
          size="lg"
          isRequired
          errorMessage="حداقل 8 کاراکتر وارد نمایید"
          label="کلمه عبور"
          name="password"
          placeholder="حداقل 8 کاراکتر"
          type="password"
          validate={(value) => {
            if (value.length < 8) {
              return "حداقل 8 کاراکتر وارد نمایید"
            }
          }}
        />

        <div className="flex w-full gap-2 mt-2">
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            type="submit"
            className="w-full h-12 sm:h-14 text-lg sm:text-xl"
          >
            ثبت
          </Button>
        </div>
        <div className="flex items-center justify-center w-full gap-4 my-2">
          <Divider className="w-1/4" />
          <span className="text-sm sm:text-base">یا</span>
          <Divider className="w-1/4" />
        </div>

        <Button
          variant="faded"
          color="primary"
          className="h-12 sm:h-14 w-full text-lg sm:text-xl"
          onPress={() => {
            switchToLogin()
            dispatch(showLogin({ show: true, path: "" }))
          }}
        >
          ورود
        </Button>
      </Form>

      {/* OTP Verification Form */}
      <Form
        className={`w-full max-w-md ${show ? "flex flex-col items-center gap-4 sm:gap-6" : "hidden"}`}
        onSubmit={verifyHandler}
      >
        <div className="mb-2 sm:mb-4">
          <LogoIcon />
        </div>

        <span className="text-center text-sm sm:text-base mb-4">کد شش رقمی برای شما ارسال شد</span>

        <div className="w-full flex justify-center">
          <InputOtp
            dir="ltr"
            length={6}
            size="lg"
            name="otp"
            className="w-full max-w-xs"
            onComplete={(e) => {
              console.log(e)
            }}
          />
        </div>

        <Inputs isRequired={false} size="sm" value={phone} name="phone" hidden={true} />

        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          className="w-full h-12 sm:h-14 text-lg sm:text-xl mt-4"
          variant="solid"
          type="submit"
        >
          تایید کد
        </Button>

        <Button variant="light" className="w-full text-sm sm:text-base" onPress={() => setOtp(false)}>
          بازگشت به فرم ثبت نام
        </Button>
      </Form>
    </div>
  )
}
