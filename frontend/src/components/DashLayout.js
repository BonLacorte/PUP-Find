import { Outlet } from 'react-router-dom'
import DashFooter from './DashFooter'
import DashHeader1 from './DashHeader1'
import Draggable from 'react-draggable';
import './DashLayout.css'

const DashLayout = () => {
    return (
        <>
            <div className='hidden lg:flex lg:w-full'>
                <DashHeader1 />
            </div>
            <Draggable>
                <div className="dash-container scrollable-container h-[90vh] border-green-700">
                    <Outlet />
                </div>
            </Draggable>
            <div className='lg:hidden'>
                <DashFooter />
            </div>
        </>
    )
}
export default DashLayout