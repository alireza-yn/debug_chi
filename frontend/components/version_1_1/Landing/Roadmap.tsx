"use client";
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React from 'react'

type Props = {}

const Roadmap = (props: Props) => {

    const {theme} = useTheme()
  return (
    <div className='w-full flex flex-col justify-center gap-4 items-center text-violet-500 min-h-[700px]  box-border p-5'>
            <h2 className='text-2xl'>چگونه از خدمات استفاده کنیم</h2>
            {
                theme == "light" ?  
                <Image src={"/landing/card_light.svg" }  width={1400} height={700} className='mx-auto' alt='چگونه از خدمات استفاده کنیم' />
                : 
                <Image src={"/landing/card_dark.svg" }  width={1400} height={700} className='mx-auto' alt='چگونه از خدمات استفاده کنیم' />
            }
    </div>
  )
}

export default Roadmap

