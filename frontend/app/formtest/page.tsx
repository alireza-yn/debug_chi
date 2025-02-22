import { CreateForm } from '@/components/Forms/CreateForm'
import SignUp from '@/components/Forms/SignUp'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='max-w-[800px] mx-auto'>
        <SignUp />
    </div>
  )
}

export default page