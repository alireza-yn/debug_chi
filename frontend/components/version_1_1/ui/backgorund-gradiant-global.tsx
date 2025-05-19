import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const BackgroundGlobalGradient = ({ children }: Props) => {
  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <div className="absolute -left-[700px] -top-[416px] w-[1400px] h-[832px]  bg-bg_global_blur/60 blur-[500px] to-transparent z-0 pointer-events-none" />
      <div className="absolute -right-[700px] -bottom-[416px] w-[1400px] h-[832px]  bg-bg_global_blur/60 blur-[500px] to-transparent z-0 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default BackgroundGlobalGradient
