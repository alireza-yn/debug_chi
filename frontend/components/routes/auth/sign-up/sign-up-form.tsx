import React, { FormEvent, useEffect } from "react";
import { Form, Input, Button, Divider, InputOtp } from "@heroui/react";
import { LogoIcon } from "@/components/ui/icons";
import { perform_post } from "@/lib/api";
import * as motion from "motion/react-client"
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";



type Props = {
  switchToLogin:()=>void
}
export default function SignUpForm({switchToLogin}:Props) {
  const [show, setOtp] = React.useState(false);
  const [phone , setPhone] = React.useState<any>('')
  const [request,setRequest] = React.useState(false)
  const path = usePathname()
  const [isLoading,setIsLoading] = React.useState(false)
  const [message,setMessage]= React.useState({
    user_phone:""
  })


  const registerHandler = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    let data = Object.fromEntries(new FormData(e.currentTarget));
    const response = await perform_post('auths/user_register/',data)
    

    if (response.success){
      setOtp(true)
      setPhone(data.user_phone)
      setMessage({ user_phone: "" }); 
    }
    if (response.status === 400) {
      setMessage((prev) => ({
        ...prev,
        user_phone: response.data.user_phone?.[0] || "", // تنظیم پیام خطا از سرور
      }));
    
    }
    
  }


  const verifyHandler =async (e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    setIsLoading(true)
    let data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(data)
    const response = await perform_post('auths/verify_otp/',data)

    if(response.success){
      Cookies.set("token",response.access)
      window.location.href = path
      setIsLoading(false)
    }
  }

  // useEffect(()=>{
  //   verifyHandler()
  // },[request])



  return (
    <>
    <Form
      className={`w-full box-border p-5 ${show ? 'hidden' : 'flex' }  flex-col gap-4 items-center `}
      onSubmit={registerHandler}
    >
      <LogoIcon />
      <Input
        isRequired
        errorMessage={message.user_phone || ""}
        label="شماره تلفن"
        name="user_phone"
        placeholder="09xxxxxxxxx"
        type="text"
        validate={(value)=>{
          if (value.length > 11 || value.length < 11){
            return "شماره تلفن وارد شده صحیح نیست"
          }else if (!value.startsWith("09",0)){
            return "شماره تلفن وارد شده صحیح نیست"
          }
        }}
      />
      <div className="flex w-full gap-4">
        <Input
          isRequired
          errorMessage="نام خود را وارد نمایید"
          label="نام"
          name="first_name"
          placeholder="جان"
          type="text"
        />
        <Input
          isRequired
          errorMessage="نام خانوادگی را وارد نمایید"
          label="نام خانودگی"
          name="last_name"
          placeholder="دو"
          type="text"
         
        />
      </div>
      <Input
        isRequired
        errorMessage="ایمیل صحیح وارد نمایید"
        label="ایمیل"
        name="email"
        placeholder="abc@gmail.com"
        type="email"
      />
      <Input
        isRequired
        errorMessage="نام کاربری صحیح نمی باشد"
        label="نام کاربری"
        name="username"
        placeholder="HelloWorld"
        type="text"
      />
      <Input
        isRequired
        errorMessage="ایمیل صحیح وارد نمایید"
        label="کلمه عبور"
        name="password"
        placeholder="حداقل 8 کاراکتر"
        type="password"
        validate={(value)=>{
          if (value.length < 8 ){
            return "حداقل 8 کاراکتر وارد نمایید"
          }
        }}

      />
      <div className="flex w-full gap-2">
        <Button color="warning" variant="shadow" type="submit" className="w-full h-14 text-xl" >
          ثبت
        </Button>
      </div>
      <div className="flex items-center justify-center w-full gap-4">
        <Divider className="w-1/4" />
        <span>یا</span>
        <Divider className="w-1/4" />

      </div>
      <Button variant="faded" color="warning" className="h-14 w-full text-xl" onPress={switchToLogin}>ورود</Button>
    </Form>
    
    <Form className={`w-full ${show ? "flex flex-col items-center px-4 box-border" : "hidden"}`} onSubmit={verifyHandler}>


        <span>کد شش رقمی برای شما ارسال شد</span>
        <InputOtp dir="ltr" length={6} size="lg" name="otp" onComplete={(e)=>{
          console.log(e)
        }}/>
        <Input hidden value={phone} name="phone" className="hidden"/>
        <Button isLoading={isLoading} className="w-full" variant="flat" color="warning"  type="submit">تایید کد</Button>
    </Form>
    
    </>
  
  );
}

//031 0460 784 932