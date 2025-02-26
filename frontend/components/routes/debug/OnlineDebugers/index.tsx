"use client";
import { PinContainer } from '@/components/ui/ace/3d-pin'
import React from 'react'

type Props = {}

const OnlineDebugers = (props: Props) => {
  return (
    <section className='max-w-7xl border mx-auto min-h-[400px] my-10 flex items-center justify-center'>
              <PinContainer
        title="/ui.aceternity.com"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            Aceternity UI
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
        </div>
      </PinContainer>
    </section>
  )
}

export default OnlineDebugers