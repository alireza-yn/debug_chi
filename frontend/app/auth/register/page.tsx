import { SignUpForm } from "@/components/routes/auth/sign-up/signup-form";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <SignUpForm />
    </div>
  );
};

export default page;
