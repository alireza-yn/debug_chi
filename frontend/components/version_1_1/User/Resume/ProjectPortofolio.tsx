import { Button } from "@heroui/react";
import Image from "next/image";
import React from "react";

type Props = {};

const ProjectPortofolio = (props: Props) => {
  return (
    <div className="w-full grid grid-cols-3 gap-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="min-h-[400px] rounded-3xl relative overflow-hidden"
        >
          <Image
            src="/images/test.png"
            alt="image"
            fill
            className="object-cover"
          />
          <div className="w-full flex justify-between items-center box-border px-4 absolute bottom-0 h-20 bg-black">
            <Button variant="light" color="secondary">
              مشاهده
            </Button>
            <span>project_name</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectPortofolio;
