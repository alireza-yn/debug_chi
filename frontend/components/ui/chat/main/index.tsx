import React from 'react'
import SendChat from '../send'
import TopChat from '../header'

type Props = {
  mode:string
}

const MainChat = (props: Props) => {
  return ( 
    <div className='w-full flex flex-col h-full p-5 box-border bg-[#181818] rounded-tl-lg rounded-bl-lg'>
        <div className='h-24 rounded-lg bg-[#282828] flex items-center justify-start box-border px-5'>
        <TopChat />
        </div>
        <div className='flex-1 flex '>

        </div>
        <div className='h-40 grid grid-cols-1  rounded-md'>
            <div className=' border-stone-700 h-full'>
              {
                props.mode == "chat" ?  <SendChat /> : ""
              }
            </div>
            {/* <div >

            </div> */}
        </div>
    </div>
  )
}

export default MainChat