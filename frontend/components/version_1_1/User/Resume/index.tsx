import React from "react";
import LanguageSection from "./LanguageSection";
import { Main } from "@/components/types/user.types";
import ProjectPortofolio from "./ProjectPortofolio";
import EducationSection from "./EducationSection";
import ForigenLanguageSection from "./ForigenLanguageSection";
import Testimonials from "./TestimonialSection";
import InteractiveDiagram from "./JobHistory/intreactive-digram";
import JobHistory from "./JobHistory";
import { Divider } from "@heroui/react";

type Props = {};

const UserResume = ({ data }: { data: Main }) => {
  return (
    <div className="w-full flex flex-col gap-10 items-center h-auto box-border p-5">
      <LanguageSection
        debugger_bio={data.debugger_bio}
        languages={data.user_language}
      />
      <Divider className="w-3/4"/>
      <JobHistory />
      <Divider className="w-3/4"/>
      {/* <InteractiveDiagram /> */}
      <ProjectPortofolio data={data.user_portfolios}/>
      <Divider className="w-3/4"/>

      <EducationSection />
      <Divider className="w-3/4"/>
      <ForigenLanguageSection />
      <Divider className="w-3/4"/>
 
      <Testimonials />
    </div>
  );
};

export default UserResume;
