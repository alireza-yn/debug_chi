import { CoustomUserIcon } from "@/components/ui/icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import SignUpForm from "./sign-up-form";
import * as motion from "motion/react-client"
import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { showLogin } from "@/redux/slices/globalSlice";
export default function SignUp() {
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();

  const {sign_up} = useAppSelector((state:RootState)=>state.gloabal)
  const dispatch = useAppDispatch()
  useEffect(()=>{
    if (sign_up){
      onOpen()
    }
  },[sign_up])

  const closeHandler = ()=>{
    onClose()
    dispatch(showLogin(true))

  }

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        color="warning"
        startContent={<CoustomUserIcon />}
      >
        <span className="text-foreground">ثبت نام</span>
      </Button>

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
              <DrawerHeader className="flex gap-1 items-center relative mt-5 ">
    
                <Button endContent={<ArrowLeft />} variant="flat" color="warning" onPress={onClose} className="absolute left-5">بازگشت</Button>
              </DrawerHeader>
              <DrawerBody className="flex items-center justify-center ">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                          duration: 0.4,
                          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                      }}
                    className="w-[500px] min-h-[600px] rounded-lg border border-amber-950 flex items-center justify-center"
                    >
                        <SignUpForm switchToLogin={closeHandler}/>
                    </motion.div>
              </DrawerBody>
              <DrawerFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
