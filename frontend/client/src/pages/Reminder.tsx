import React from 'react'
import Aside from '../components/AsideBar'
import Calendar from '../components/Calendar'

interface Props {}

function Reminder(props: Props) {
    const {} = props

    return (
        <div>
         <div className="bg-black h-screen w-[13vw] fixed">
        <Aside />
      </div>
       
           <div className="w-[85vw] ml-[13vw] p-8 bg-gray-100 h-screen ">
         
           <Calendar />
           
           </div>
        
        </div>
    )
}

export default Reminder
