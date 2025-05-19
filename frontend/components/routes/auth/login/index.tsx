import { CoustomUserIcon, CustomLoginIcon } from "@/components/ui/icons";
import { perform_post } from "@/lib/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
  Form,
  Divider,
  Card,
  DrawerBody,
  Button,
  CardBody,
  Tabs,
  Tab,
  Link as HeroLink,
} from "@heroui/react";

import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { usePathname, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { showLogin, showSignUp } from "@/redux/slices/globalSlice";
import {
  ArrowLeft,
  CircleUserRound,
  Headset,
  Lock,
  Phone,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import BackgorundGLobalGradiant from "@/components/version_1_1/ui/backgorund-gradiant-global";
import Input from "@/components/version_1_1/ui/input";

export default function Login() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state: RootState) => state.gloabal);
  const path = usePathname();
  // const query = useSearchParams();
  const [selected, setSelected] = useState<string>("login");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState({
    username: "",
    password: "",
    server: "",
  });

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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    let data = Object.fromEntries(new FormData(e.currentTarget));

    e.preventDefault();
    setIsLoading(true);

    Cookies.remove("token");
    const response = await perform_post("auths/login/", data);
    console.log(response);
    if (response.success && response.user) {
      Cookies.set("token", response.access);
      localStorage.setItem("user_data", JSON.stringify(response.user));
      window.location.href = path;
      dispatch(showLogin({ show: false, path: "" })); // بستن مودال لاگین
    } else {
      setError({
        ...error,
        server: response.message || "نام کاربری یا رمز عبور نادرست است",
      });
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
          <BackgorundGLobalGradiant>
            <Button
              endContent={<ArrowLeft size={28} />}
              variant="light"
              isIconOnly
              size="lg"
              onPress={() => {
                dispatch(showLogin({ show: false, path: "" }));
                onClose();
              }}
              className="absolute left-4 top-2"
            ></Button>
            <DrawerBody className="h-screen">
              <div className="flex flex-col items-center justify-center h-full w-full ">
                <Card className="min-w-[500px] max-w-[600px] h-3/4 border border-default-100 bg-bg_card">
                  <CardBody className="overflow-hidden">
                    <Tabs
                      fullWidth
                      className="mt-4"
                      aria-label="Tabs form"
                      // selectedKey={selected}
                      size="md"
                      // onSelectionChange={setSelected}
                    >
                      <Tab
                        key="login"
                        title={
                          <div className="flex gap-4 items-center">
                            <CircleUserRound size={16} />
                            <span>کاربر عادی</span>
                          </div>
                        }
                      >
                        <motion.div className="rounded-2xl w-full h-full flex items-center justify-center">
                          <Form
                            className="w-full flex flex-col min-h-[500px] items-center justify-center  px-5 rounded-lg"
                            onSubmit={handleSubmit}
                          >
                            <Input
                              startContent={<UserCircle color="gray" />}
                              isRequired
                              errorMessage={"اطلاعات وارد شده صحیح نمی باشد"}
                              label="نام کاربری"
                              labelPlacement="outside"
                              name="username"
                              size="lg"
                              placeholder="نام کاربری ، ایمیل یا شماره تلفن"
                              type="text"
                              variant="faded"
                            />

                            <Input
                              startContent={<Lock color="gray" />}
                              isRequired
                              label="کلمه عبور"
                              labelPlacement="outside"
                              placeholder="کلمه عبور را وارد نمایید"
                              name="password"
                              size="lg"
                              type="password"
                              validate={(value) => {
                                if (value.length < 8) {
                                  return "حداقل 8 کاراکتر باید وارد کنید";
                                }
                              }}
                            />
                            <div className="w-full flex items-center justify-start my-2">
                              <Button
                              as={Link}
                                variant="light"
                                href={"/auth/forget-password/"}
                                className="text-tiny text-blue-500 underline"
                                onPress={() =>{
                                  dispatch(showLogin({ show: false, path: "" }))
                                  onClose()
                                }
                                }
                              >
                                بازیابی کلمه عبور؟
                              </Button>
                            </div>
                            {error.server && (
                              <p className="text-red-500 text-sm mt-2">
                                {error.server}
                              </p>
                            )}

                            <div className="flex flex-col gap-2 w-full">
                              <br />
                              <Button
                                isLoading={isLoading}
                                variant="solid"
                                className="bg-btn_primary"
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
                                as={HeroLink}
                                isDisabled={isLoading}
                                variant="faded"
                                size="lg"
                                onPress={() => {
                                  onClose();
                                  dispatch(
                                    showSignUp({ show: true, path: "" })
                                  );
                                }}
                              >
                                ثبت نام
                              </Button>
                            </div>
                          </Form>
                        </motion.div>
                      </Tab>
                      <Tab
                        key="sign-up"
                        title={
                          <div className="flex gap-4 items-center">
                            <Headset size={16} />
                            <span>متخصص</span>
                          </div>
                        }
                      >
                        <motion.div className="rounded-2xl w-full h-full flex items-center justify-center">
                          <Form
                            className="w-full flex flex-col min-h-[500px] items-center justify-center  px-5 rounded-lg"
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
                            />

                            {error.server && (
                              <p className="text-red-500 text-sm mt-2">
                                {error.server}
                              </p>
                            )}

                            <div className="flex flex-col gap-2 w-full">
                              <br />
                              <Button
                                isLoading={isLoading}
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
                                size="lg"
                                variant="faded"
                                onPress={() => {
                                  onClose();
                                  dispatch(
                                    showSignUp({ show: true, path: "" })
                                  );
                                }}
                              >
                                ثبت نام
                              </Button>
                            </div>
                          </Form>
                        </motion.div>
                      </Tab>
                    </Tabs>
                  </CardBody>
                </Card>
              </div>
            </DrawerBody>
          </BackgorundGLobalGradiant>
        )}
      </DrawerContent>
    </Drawer>
  );
}
