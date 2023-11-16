import React from 'react'
import { Link } from 'react-router-dom'

const DashHeader1 = () => {
    return (
        <div className='hidden lg:flex lg:w-full h-[10vh]'>
            <div className="w-full bg-primaryColor top-0 left-0 flex flex-row justify-between items-center lg:px-32 xl:px-56">
                <Link to={`/dash`}>
                    <img alt="" src="https://file.rendit.io/n/lR73tpTfe2DprtLbazzZ.png" className="self-start"/>
                </Link>
                <div className="flex flex-row gap-8 h-12 items-center p-2">
                    <button className="self-start flex flex-row gap-4 w-32 items-start">
                        <div className="relative flex flex-col pb-3 w-8 items-end">
                            <img alt="Message-icon" src="https://file.rendit.io/n/P8cQrPTjOFdfN5wPuSX4.png" className="w-8 h-6 absolute top-px left-0" />
                        </div>
                        <div className="font-sans font-medium tracking-[0.5] leading-[16px] text-white mt-2">
                            <Link to={`/dash/chats`}>
                                Messages
                            </Link>
                        </div>
                    </button>
                    <button className="flex flex-row gap-4 w-32 shrink-0 items-center">
                        <img alt="Profile-icon" src="https://file.rendit.io/n/zTAMToJwUTu7k5AEf6hs.svg" className="self-start w-6 shrink-0" />
                        <div className="font-sans font-medium text-white"> 
                            <Link to={`/dash/profile`}>
                                My Account
                            </Link>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashHeader1