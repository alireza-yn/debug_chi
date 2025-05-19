import ResetPassword from "@/components/Forms/reset-password";
import BackgroundGlobalGradient from "@/components/version_1_1/ui/backgorund-gradiant-global";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) => {
  const { code } = await searchParams;



  if (!code){
    return redirect('/')
  }

else{

  return (
    <BackgroundGlobalGradient>

    <div className="w-full h-screen flex items-center justify-center">
      <ResetPassword token={code}/>
    </div>
    </BackgroundGlobalGradient>
  );
}
};

export default page;
