"use client";
import { Ripple } from "@/components/ui/magicUI/Ripple";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { Avatar, Button, Spinner } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import coffee_1 from "@/public/lottie/coffee_1.json";
import coffee_2 from "@/public/lottie/coffee_2.json";
import { motion, AnimatePresence } from "framer-motion";
import { setFindUser } from "@/redux/slices/globalSlice";
import { useRouter } from "next/navigation";
import { setClearAi, setSelectedCategory } from "@/redux/slices/aiSlice";
import { Main } from "@/components/types/user.types";
import { perform_get } from "@/lib/api";
import { setUser } from "@/redux/slices/userSlice";
import { response } from "express";

type Props = {};
type LottieAnimation = Record<string, any>;

const FindUser = (props: Props) => {
  const { find_user } = useAppSelector((state) => state.gloabal);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<any>([{
    image_profile:"",
    username:""
  }]);
  const [currentAnimation, setCurrentAnimation] =
    useState<LottieAnimation>(coffee_2);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // const getUsers = async () => {
  //   const response = await perform_get("auths/register/");
  //   if (response) {
  //     setUser(response);
  //   }
  // };
  // console.log(response)
  // useEffect(()=>{
  //   getUsers()
  // },[])
  useEffect(() => {
    if (find_user) {
      const timer = setTimeout(() => {
        console.log("hello_user");
      }, 3000);

      return () => clearTimeout(timer); // برای جلوگیری از اجرای ناخواسته تایمر قبلی
    }
  }, [find_user]);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/sound/water.mp3");

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleLottieClick = () => {
    // Toggle between animations
    setCurrentAnimation(currentAnimation === coffee_2 ? coffee_1 : coffee_2);

    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset audio to start
      audioRef.current
        .play()
        .catch((err) => console.error("Audio playback failed:", err));
    }
  };

  return (
    <>
      {/* <Button onPress={() => dispatch(setFindUser(true))}>show</Button> */}
      <div
        className={` ${
          find_user ? " h-full p-4" : "max-h-0 h-0 overflow-hidden p-0"
        } absolute bottom-0 z-50 w-full bg-transparent box-border transition-all duration-500`}
      >
        <div className="w-full h-full rounded-xl bg-foreground-100 relative">
          <div className="w-full h-3/5 absolute bottom-0 z-50 flex items-center justify-center box-border p-5">
            <div className="rounded-xl bg-foreground-100 flex flex-col items-center justify-start gap-4 w-full h-full box-border py-5">
              <div className="text-center font-mediumSans text-2xl">
                <span>در حال پیدا کردن برنامه نویس</span>
                <span className="flex items-center justify-center gap-2  mt-2">
                  برای شما هستیم
                </span>
                <Spinner variant="wave" color="primary" />
              </div>
              <motion.div
                className="w-52 h-52 mt-5 cursor-pointer"
                onClick={handleLottieClick}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAnimation === coffee_1 ? "coffee1" : "coffee2"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Lottie animationData={currentAnimation} loop={true} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <div className="  h-auto">
                <Button
                  variant="flat"
                  color="danger"
                  onPress={() => {
                    dispatch(setClearAi());
                    window.location.href = "/";
                    dispatch(setFindUser(false));
                  }}
                >
                  لغو
                </Button>
              </div>
            </div>
          </div>
          <div>

          {
            users.map((item:any)=>{
              return(
                <Avatar key={item.username} src={item.image_profile} name={item.username}/>
              )
            })
          }
          </div>
          <Ripple

            animate={"true"}
            mainSize={100}
            top="50%"
            bg_color="bg-gray-500"
          />
        </div>
      </div>
    </>
  );
};

export default FindUser;
