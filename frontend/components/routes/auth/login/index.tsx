import { CoustomUserIcon, CustomLoginIcon } from "@/components/ui/icons";
import { perform_post } from "@/lib/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  Button,
  useDisclosure,
  Input,
  Form,
  Divider,
} from "@heroui/react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { showLogin, showSignUp } from "@/redux/slices/globalSlice";
import { ArrowLeft, Lock, Phone } from "lucide-react";

export default function Login() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state: RootState) => state.gloabal);
  const path = usePathname()
  const query = useSearchParams()


  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState({ username: "", password: "", server: "" });

  useEffect(() => {
    if (login) {
      onOpen();
    }
  }, [login]);

  // اعتبارسنجی ورودی‌ها قبل از ارسال
  const validateForm = () => {
    let errors = { username: "", password: "", server: "" };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = "لطفا نام کاربری یا ایمیل یا شماره تلفن را وارد کنید";
      isValid = false;
    }
    if (!formData.password.trim()) {
      errors.password = "لطفا کلمه عبور را وارد کنید";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  // ارسال فرم
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError({ username: "", password: "", server: "" }); // پاک کردن ارورها قبل از ارسال

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    Cookies.remove("token");
    const response = await perform_post("auths/login/", formData);

    if (response.success && response.user) {
      Cookies.set("token", response.access);
      localStorage.setItem("user_data", JSON.stringify(response.user));
      window.location.href = `${path}?${query.toString()}`
      dispatch(showLogin({show:false,path:""})); // بستن مودال لاگین
    } else {
      setError({ ...error, server: response.message || "نام کاربری یا رمز عبور نادرست است" });
      setIsLoading(false);
    }
  };

  return (
    <Drawer
    dir="rtl"
      hideCloseButton
      size="full"
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: { opacity: 1, x: 0, dur: 0.3 },
          exit: { x: 100, opacity: 0, dur: 0.3 },
        },
      }}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader>
              <Button
                endContent={<ArrowLeft />}
                variant="flat"
                color="warning"
                onPress={() => {
                  dispatch(showLogin({show:false,path:""}));
                  onClose();
                }}
                className="absolute left-5"
              >
                بازگشت
              </Button>
            </DrawerHeader>

            <motion.div className="rounded-2xl w-full h-full flex items-center justify-center">
              <Form
                className="w-full max-w-96 flex flex-col min-h-[500px] items-center justify-center shadow-sm shadow-yellow-500 p-5 rounded-lg"
                onSubmit={handleSubmit}
              >
                <Input
                  startContent={<Phone color="gray" />}
                  isRequired
                  errorMessage={error.username}
                  label="نام کاربری"
                  labelPlacement="outside"
                  name="username"
                  size="lg"
                  placeholder="نام کاربری خود را وارد نمایید"
                  type="text"
                  variant="faded"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />

                <Input
                  startContent={<Lock color="gray" />}
                  isRequired
                  errorMessage={error.password}
                  label="کلمه عبور"
                  labelPlacement="outside"
                  placeholder="کلمه عبور را وارد نمایید"
                  name="password"
                  size="lg"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                {error.server && (
                  <p className="text-red-500 text-sm mt-2">{error.server}</p>
                )}

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
                      onClose();
                      dispatch(showSignUp({show:true,path:""}));

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
