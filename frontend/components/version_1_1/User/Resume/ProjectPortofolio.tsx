import { UserPortfolio } from "@/components/types/user.types";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { FilePlus2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProjectPortofolio = ({ data }: { data: UserPortfolio[] }) => {
  if (data.length == 0) {
    return (
      <div className="w-full h-full py-8 border border-dashed border-slate-700 flex flex-col items-center justify-center gap-3 rounded-3xl box-border">
        <Button
          variant="flat"
          isIconOnly
          radius="full"
          startContent={<FilePlus2 />}
          size="lg"
          color="secondary"
        ></Button>
        <span>نمونه کار جدید</span>
      </div>
    );
  }
  return (
    <div className="w-full grid grid-cols-3 gap-2 relative">
    
      {data.map((item) => (
        <div
          key={item.id}
          className="min-h-[400px] rounded-3xl relative overflow-hidden"
        >
          <Image
            src={item.images[0].image}
            alt="image"
            fill
            className="object-cover"
          />
          <div className="w-full flex justify-between items-center box-border px-4 absolute bottom-0 h-20 bg-black">
            <ShowPortfolioDetails data={item} />
            <span>{item.name}</span>
          </div>
        </div>

      ))}
      <div className="w-full min-h-[400px] rounded-3xl border border-dashed border-default-100 flex flex-col items-center justify-center gap-4">
      <Button
          variant="flat"
          isIconOnly
          radius="full"
          startContent={<FilePlus2 />}
          size="lg"
          color="secondary"
        ></Button>
        <span>نمونه کار جدید</span>
      </div>
    </div>
  );
};

export default ProjectPortofolio;

const ShowPortfolioDetails = ({ data }: { data: UserPortfolio }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button variant="light" color="secondary" onPress={onOpen}>
        مشاهده
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        size="full"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                {data.name}
              </DrawerHeader>
              <DrawerBody>
                <div className="flex w-full h-full gap-4 relative">
                  <div className="flex-1 flex flex-col box-border gap-4 overflow-y-auto rounded-3xl scrollbar-left">
                    {data.images.map((image) => {
                      return (
                        <div
                          key={image.id}
                          className="relative w-full min-h-[900px] rounded-lg"
                        >
                          <Image
                            src={image.image}
                            alt={data.name}
                            fill
                            objectFit="cover"
                            // className="rounded-3xl"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-[500px]" >
                    <p className="text-right whitespace-pre-line">
                      {data.description}
                    </p>
                  </div>
                </div>
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
};
