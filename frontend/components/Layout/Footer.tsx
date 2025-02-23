import { Calendar, DateValue } from "@heroui/react";
import React from "react";
import {I18nProvider} from "@react-aria/i18n";
import {today, getLocalTimeZone} from "@internationalized/date";
type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="max-w-7xl h-auto border mt-14 mx-auto grid grid-cols-1 gap-4">
        <div className="h-96 border">
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 border h-96">
            <span className="text-sm">تمامی حقوق محفوظ است</span>
        </div>
      <I18nProvider locale="fa-IR">
      <Calendar  aria-label="Date (International Calendar)" defaultValue={today(getLocalTimeZone())} className="text-orange-500"  />
    </I18nProvider>
    </footer>
  );
};

export default Footer;
