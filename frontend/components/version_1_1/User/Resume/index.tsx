import React from "react";
import LanguageSection from "./LanguageSection";
import { Main } from "@/components/types/user.types";
import ProjectPortofolio from "./ProjectPortofolio";
import EducationSection from "./EducationSection";
import ForigenLanguageSection from "./ForigenLanguageSection";
import Testimonials from "./TestimonialSection";
import InteractiveDiagram from "./JobHistory/intreactive-digram";
import JobHistory from "./JobHistory";

type Props = {};

const UserResume = ({ data }: { data: Main }) => {
  return (
    <div className="w-full flex flex-col gap-4 items-center h-auto box-border p-5">
      <LanguageSection
        debugger_bio={data.debugger_bio}
        languages={data.user_language}
      />
      <JobHistory />
      {/* <InteractiveDiagram /> */}
      <ProjectPortofolio />
      <EducationSection />
      <ForigenLanguageSection />
      <Testimonials />
    </div>
  );
};

export default UserResume;
