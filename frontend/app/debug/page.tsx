import Hero from '@/components/routes/debug/Hero';
import OnlineDebugers from '@/components/routes/debug/OnlineDebugers';
import DebugService from '@/components/routes/debug/Services';
import { Ripple } from '@/components/ui/magicUI/Ripple';
import { Button } from '@heroui/react';
import localFont from 'next/font/local';
import React from 'react';

const iranSans = localFont({
  src: "../fonts/IRANSans(FaNum)_Black.ttf",
  variable: "--font-iran-sans",
});
const page = () => {
  return (
   <main >
    <Hero iranSans={iranSans}/>
    <DebugService />
    <OnlineDebugers />
   </main>
  );
};

export default page;
