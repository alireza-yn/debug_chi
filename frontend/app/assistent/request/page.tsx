import Details from '@/components/ui/chat/details'
import MainChat from '@/components/ui/chat/main'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <main className='h-screen p-5 box-border flex '>
        <Details />
        <MainChat mode='ai'/>
    </main>
  )
}

export default page