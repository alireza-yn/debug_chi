import React from "react";
import { service } from "./data";
type Props = {};

const Services = (props: Props) => {
  return (
    <section className="w-full mt-20">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <h2 className="text-4xl text-[#CC9A06]">خدمات</h2>
      </div>

      <div className="max-w-7xl mx-auto mt-5 rounded-3xl h-[480px] shadow-sm shadow-yellow-700 grid grid-cols-5 place-content-center place-items-center gap-4">
        {service.map((item, index) => {
          return (
            <div
              key={index}
              className="w-32 h-32 bg-[#161616] border border-[#242424] shadow-md shadow-[#4747475d] rounded-[30px] flex flex-col items-center justify-center gap-2"
            >
              {item.icon}
              {item.name}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;
