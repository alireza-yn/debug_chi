import React from 'react'

type Props = {

    from:string;
    to:string;
}

const LinearGradiant = (props: Props) => {
  return (
     <div className={`bg-gradient-to-t ${props.from} ${props.to} w-full h-full`}>
    </div>
  )
}

export default LinearGradiant