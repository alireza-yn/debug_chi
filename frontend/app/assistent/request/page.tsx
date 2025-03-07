import Details from '@/components/chat/details'
import MainChat from '@/components/chat/main'
import React from 'react'


const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

const data = await searchParams
console.log(data.query)


  return (
    <main className='h-screen p-5 box-border flex '>
        <Details />
        <MainChat mode='ai'/>
    </main>
  )
}

export default page