import { CoustomUserIcon, CustomLoginIcon } from "@/components/ui/icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function Login() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
     <Button onPress={onOpen} variant="flat"  color="warning" startContent={<CustomLoginIcon />}>
      <span className="text-foreground">
      ورود
      </span>

      </Button>

      <Drawer
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
              <DrawerHeader className="flex flex-col gap-1">
                Custom Motion Drawer
              </DrawerHeader>
              <DrawerBody>
                <p>This drawer has custom enter/exit animations.</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
