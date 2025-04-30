import UserDashboard from '@/components/version_1_1/User/UserDashboard'
import { perform_get } from '@/lib/api'
import React from 'react'

type Props = {}

const page = async ({ params }: { params: { uuid: string } }) => {
    
    
    
    const response = await perform_get(`api/v1/user/${params.uuid}/`)


    console.log(response)

  return (
    <div className='w-full h-full' dir='rtl'>
        <UserDashboard user={response.user} posts={response.posts} />
    </div>
  )
}

export default page