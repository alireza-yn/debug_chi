import React, { FormEvent, useEffect } from "react";
import { Form, Divider, InputOtp } from "@heroui/react";
import { LogoIcon } from "@/components/ui/icons";
import { perform_post } from "@/lib/api";
import * as motion from "motion/react-client";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { setPath, showLogin, showSignUp } from "@/redux/slices/globalSlice";
import Inputs from "@/components/version_1_1/ui/input";
import Button from "@/components/version_1_1/ui/button";

type Props = {
  switchToLogin: () => void;
};
export default function SignUpForm({ switchToLogin }: Props) {
  const dispatch = useAppDispatch();
  const { path } = useAppSelector((state: RootState) => state.gloabal);
  const [show, setOtp] = React.useState(false);
  const [phone, setPhone] = React.useState<any>("");
  const [request, setRequest] = React.useState(false);
  const currnt_path = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState({
    user_phone: "",
  });

  const registerHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.currentTarget));
    const response = await perform_post("auths/user_register/", data);
    console.log(response)
    if (response.success) {
      setOtp(true);
      setPhone(data.user_phone);
      setMessage({ user_phone: "" });
    }
    if (response.status === 400) {
      setMessage((prev) => ({
        ...prev,
        user_phone: response.data.user_phone?.[0] || "", // تنظیم پیام خطا از سرور
      }));
    }
  };

  const verifyHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(data);
    const response = await perform_post("auths/verify_otp/", data);
    if (response.user_intro === false) {
      dispatch(setPath("/intro/programmer introduction"));
    }
    if (response.success) {
      Cookies.set("token", response.access);

      window.location.href = path || "";
      setIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   verifyHandler()
  // },[request])

  return (
    <>
      <Form
        className={`w-full box-border p-5 ${
          show ? "hidden" : "flex"
        }  flex-col gap-4 items-center `}
        onSubmit={registerHandler}
      >
        <LogoIcon />
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
              return "شماره تلفن وارد شده صحیح نیست";
            } else if (!value.startsWith("09", 0)) {
              return "شماره تلفن وارد شده صحیح نیست";
            }
          }}
        />
        <div className="flex w-full gap-4">
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
              return "حداقل 8 کاراکتر وارد نمایید";
            }
          }}
        />
        <div className="flex w-full gap-2">
          <Button
            type="submit"
            className="w-full h-14 text-xl"
          >
            ثبت
          </Button>
        </div>
        <div className="flex items-center justify-center w-full gap-4">
          <Divider className="w-1/4" />
          <span>یا</span>
          <Divider className="w-1/4" />
        </div>
        <Button
          variant="faded"
          color="primary"
          className="h-14 w-full text-xl"
          onPress={() => {
            switchToLogin();
            dispatch(showLogin({show:true,path:""}));
          }}
        >
          ورود
        </Button>
      </Form>

      <Form
        className={`w-full ${
          show ? "flex flex-col items-center px-4 box-border" : "hidden"
        }`}
        onSubmit={verifyHandler}
      >
        <span>کد شش رقمی برای شما ارسال شد</span>
        <InputOtp
          dir="ltr"
          length={6}
          size="lg"
          name="otp"
          onComplete={(e) => {
            console.log(e);
          }}
        />
        <Inputs isRequired={false} size="sm" value={phone} name="phone" hidden={true} />
        <Button
          isLoading={isLoading}
          className="w-full"
          variant="flat"
          color="primary"
          type="submit"
        >
          تایید کد
        </Button>
      </Form>
    </>
  );
}

//031 0460 784 932
