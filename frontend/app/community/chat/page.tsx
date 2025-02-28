import ChatList from '@/components/ui/chat/chatList.tsx'
import MainChat from '@/components/ui/chat/main'
import ChatSidebar from '@/components/ui/chat/side'
import React from 'react'

const page = () => {
  return (
    <main className='flex gap-4 p-5 box-border h-screen mx-auto'>
        <div className='w-40 bg-[#181818] box-border px-1 rounded-md'>
        <ChatSidebar />
        </div>
        <div className='min-w-[500px] bg-[#181818] p-4 box-border rounded-lg'>
            <ChatList />
        </div>
        <MainChat />
    </main>
  )
}

export default page