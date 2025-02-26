import Comments from '@/components/routes/debugger/Comments'
import Debugger from '@/components/routes/debugger/Debugger'
import axios from 'axios'
import React from 'react'

const page = async (props: any) => {
    const param = await props.params
    const searchParams = await props.searchParams
try{

  const request_user_info = await axios.get(`${process.env.server}/api/v1/get-user-info/?user=${param.debugger}`)
  const response = await request_user_info.data
  

  return (
    <div className='w-3/4 mx-auto my-10 flex flex-col gap-4'>
        <Debugger user={response} />
        <Comments />
    </div>
  )
  
}catch(error){
  return <div>user not found</div>
}
}

export default page

