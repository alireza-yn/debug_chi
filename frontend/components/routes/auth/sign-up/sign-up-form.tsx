import React from "react";
import {Form, Input, Button, Divider} from "@heroui/react";
import { LogoIcon } from "@/components/ui/icons";

export default function SignUpForm() {
  const [action, setAction] = React.useState("");

  return (
    <Form
      className="w-full box-border p-5 flex flex-col gap-4 items-center"
      onReset={() => setAction("reset")}
      onSubmit={(e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));
        console.log(data)
      }}
    >
        <LogoIcon />
      <Input
      
        isRequired
        errorMessage="شماره تلفن وارد شده صحیح نیست"
        label="شماره تلفن"
        name="phone"
        
        placeholder="09xxxxxxxxx"
        type="text"
      />
        <div className="flex w-full gap-4">
        <Input
        
        isRequired
        errorMessage="نام خود را وارد نمایید"
        label="نام"
        name="last_name"
        placeholder="جان"
        type="text"
      />
        <Input
        isRequired
        errorMessage="شماره تلفن وارد شده صحیح نیست"
        label="نام خانودگی"
        name="first_name"
        placeholder="دو"
        type="text"
      />

        </div>
      
        <Input
        
        isRequired
        errorMessage="ایمیل صحیح وارد نمایید"
        label="ایمیل"
        name="last_name"
        placeholder="abc@gmail.com"
        type="email"
      />
        <Input
        
        isRequired
        errorMessage="ایمیل صحیح وارد نمایید"
        label="نام کاربری"
        name="last_name"
        placeholder="HelloWorld"
        type="email"
      />
        <Input
        
        isRequired
        errorMessage="ایمیل صحیح وارد نمایید"
        label="کلمه عبور"
        // labelPlacement="outside-left"
        name="last_name"
        placeholder="حداقل 8 کاراکتر"
        type="email"
      />




      <div className="flex w-full gap-2">
        <Button color="warning" variant="shadow" type="submit" className="w-full h-14 text-xl" >
          ثبت
        </Button>
      </div>
    <div className="flex items-center justify-center w-full gap-4">
        <Divider className="w-1/4"/>
        <span>یا</span>
        <Divider className="w-1/4"/>
        
    </div>
      <Button variant="faded" color="warning" className="h-14 w-full text-xl">ورود</Button>

    </Form>
  );
}

