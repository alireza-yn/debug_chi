import Dashboard from '@/components/routes/user/dashboard/Dashboard'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import React from 'react'
const page = async ({params}:any) => {

  
    const param = await params
    const cookiesStore = await cookies();
    const user = await axios.get(`${process.env.server}/api/v1/get-user-info/?user=${param.uuid}`)
    const token:any = cookiesStore.get('token')?.value
    let user_id;

    if (token){
      user_id = jwtDecode(token)
      console.log(user_id)
    }
    const is_me = user.data.id === user_id ? true : false

    return (
    <div className='mt-4'>
         <Dashboard user={user.data} is_me={is_me}/>
    </div>
  )
}

export default page