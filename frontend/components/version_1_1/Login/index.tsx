import { showLogin } from '@/redux/slices/globalSlice'
import { useAppDispatch } from '@/redux/store/store'
import { Button, Tooltip } from '@heroui/react'
import { LogIn } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import ModalInfo from '../User/ModalInfo'

const Login = () => {
  const dispatch = useAppDispatch()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const user_data = Cookies.get('user_data')
    if (user_data) {
      setUserData(JSON.parse(user_data))
    }
  }, [])

  if (userData) {
    return <ModalInfo user={userData} />
  }

  return (
    <Tooltip placement="right" content={"ورود"}>
      <Button
        size="lg"
        variant="light"
        radius="full"
        isIconOnly
        startContent={<LogIn color="red" size={24} />}
        onPress={() => dispatch(showLogin(true))}
      />
    </Tooltip>
  )
}

export default Login
