import { Outlet } from 'react-router-dom'
import AdminDashHeader from './AdminDashHeader'
import AdminDashFooter from './AdminDashFooter'
import AdminDashSidebar from './AdminDashSidebar'

const AdminDashLayout = () => {
    return (
        <>
            <div>
                <div className="mx-auto w-full h-full flex flex-row">
                    <div className="w-[120px] md:w-[200px]">
                    {/* <div className="w-[80px] 800px:w-[530px]"> */}
                        <AdminDashSidebar/>
                    </div>
                    <div className="w-full justify-center flex">
                        <Outlet />
                    </div>
                </div>
            </div>
            {/* <AdminDashFooter /> */}
        </>
    )
}
export default AdminDashLayout