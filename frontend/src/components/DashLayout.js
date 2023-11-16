import { Outlet } from 'react-router-dom'
import DashFooter from './DashFooter'
import DashHeader1 from './DashHeader1'

const DashLayout = () => {
    return (
        <>
            <div className='hidden lg:flex lg:w-full'>
                <DashHeader1 />
            </div>
            
            <div className="dash-container">
                <Outlet />
            </div>
            <div className='lg:hidden'>
                <DashFooter />
            </div>
        </>
    )
}
export default DashLayout