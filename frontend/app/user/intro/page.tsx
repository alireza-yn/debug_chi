import Intro from '@/components/routes/user/intro/Intro'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Intro />
    </div>
  )
}

export default page