import { CoustomUserIcon, CustomLoginIcon } from "@/components/ui/icons";
import { perform_post } from "@/lib/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Input,
  Form,
  Divider,
} from "@heroui/react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SignUp from "../sign-up/sign-up";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { showLogin, showSignUp } from "@/redux/slices/globalSlice";
import { ArrowLeft, Lock, Phone } from "lucide-react";
export default function Login() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();
  console.log(path);
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state: RootState) => state.gloabal);
  const closeHandler = () => {
    dispatch(showSignUp(true));
  };

  useEffect(() => {
    if (login) {
      onOpen();
      console.log("first");
    }
  }, [login]);

  return (
    <Drawer
      hideCloseButton
      size="full"
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            x: 0,
            dur: 0.3,
          },
          exit: {
            x: 100,
            opacity: 0,
            dur: 0.3,
          },
        },
      }}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="">
              <Button
                endContent={<ArrowLeft />}
                variant="flat"
                color="warning"
                onPress={() => {
                  dispatch(showLogin(false));
                  onClose();
                }}
                className="absolute left-5"
              >
                بازگشت
              </Button>
            </DrawerHeader>
            <motion.div className="rounded-2xl w-full h-full flex items-center justify-center">
              <Form
                className="w-full max-w-96 flex flex-col min-h-[500px] items-center justify-center shadow-sm shadow-yellow-500  p-5 rounded-lg"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  let data = Object.fromEntries(new FormData(e.currentTarget));
                  const response = await perform_post("auths/login/", data);
                  console.log(response);
                  if (response.success) {
                    Cookies.set("token", response.access);
                    setIsLoading(false);
                    window.location.href = path;
                  }
                }}
              >
                <Input
                  startContent={<Phone color="gray" />}
                  isRequired
                  errorMessage="نام کاربری خود را وارد نمایید"
                  label="نام کاربری"
                  labelPlacement="outside"
                  name="username"
                  size="lg"
                  placeholder="نام کاربری خود را وارد نمایید"
                  type="text"
                  variant="faded"
                />
                <Input
                  startContent={<Lock color="gray" />}
                  isRequired
                  errorMessage="کلمه عبور را وارد نمایید"
                  label="کلمه عبور"
                  labelPlacement="outside"
                  placeholder="کلمه عبور را وارد نمایید"
                  name="password"
                  size="lg"
                  type="password"
                />
                <div className="flex flex-col gap-2 w-full">
                  <br />
                  <Button
                    isLoading={isLoading}
                    variant="solid"
                    color="warning"
                    type="submit"
                    size="lg"
                  >
                    ورود
                  </Button>
                  <div className="flex items-center justify-center w-full gap-4">
                    <Divider className="w-1/4" />
                    <span>یا</span>
                    <Divider className="w-1/4" />
                  </div>
                  <Button
                    isDisabled={isLoading}
                    variant="faded"
                    color="warning"
                    size="lg"
                    onPress={() => {
                      onClose()
                      dispatch(showSignUp(true))
                    }}
                  >
                    ثبت نام
                  </Button>
                </div>
              </Form>
            </motion.div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
