import React from 'react';
import './App.css'; 
import { Route, Routes } from 'react-router-dom';
import ChatPage from './features/chat/ChatPage';
import PersistLogin from './features/auth/PersistLogin';
import Prefetch from './features/auth/Prefetch';
import ChatProvider from './context/ChatProvider';
import DashLayout from './components/DashLayout';
import ProfilePageLoad from './features/profile/ProfilePageLoad';
import ProfileEditLoad from './features/profile/ProfileEditLoad';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AdminLogin from './admin/features/auth/AdminLogin';
import AdminPersistLogin from './admin/features/auth/AdminPersistLogin';
import AdminDash from './admin/features/dashboard/AdminDash';
import AdminRequireAuth from './admin/features/auth/AdminRequireAuth';
import Layout from './components/Layout';
import Public from './components/Public';
import AdminPublic from './admin/components/AdminPublic';
import AdminDashLayout from './admin/components/AdminDashLayout';
import AdminReportPage from './admin/features/report/AdminReportPage';
import AdminMessagesPage from './admin/features/messages/AdminMessagesPage';
import AdminUsersPage from './admin/features/users/AdminUsersPage';
import AdminReferenceNumberPage from './admin/features/referenceNumber/AdminReferenceNumberPage';
import MissingPage from './features/missing/MissingPage';
import NewMissingForm from './features/missing/NewMissingForm';
import NewFoundForm from './features/found/NewFoundForm';
import DonePage from './features/found/DonePage';
import MissingLocatePage from './features/missing/MissingLocatePage';
import FoundLocatePage from './features/found/FoundLocatePage';
import HomePage1 from './features/home/HomePage1';
import AdminNewUserForm from './admin/features/users/AdminNewUserForm';
import AdminEditUserLoad from './admin/features/users/AdminEditUserLoad';
import AdminNewFoundLoad from './admin/features/report/AdminNewFoundLoad';
import AdminNewMissingLoad from './admin/features/report/AdminNewMissingLoad';
import AdminClaimedReciptLoad from './admin/features/report/AdminClaimedReciptLoad';
import AdminDownloadReceipt from './admin/features/referenceNumber/AdminDownloadReceipt';
import AdminClaimedReportInfo from './admin/features/referenceNumber/AdminClaimedReportInfo';
import AdminReportInfo from './admin/features/report/AdminReportInfo';
import AdminEditFoundForm from './admin/features/report/AdminEditFoundForm';
import AdminEditMissingForm from './admin/features/report/AdminEditMissingForm';
import AdminItemPage from './admin/features/report/AdminItemPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminFoundReportPage from './admin/features/report/AdminFoundReportPage';
import AdminMissingReportPage from './admin/features/report/AdminMissingReportPage';
// const socket = socketIOClient('http://localhost:3500');

function App() {
  return (
    <ChatProvider>
      <Routes>
          <Route path="/" element={<Layout/>} exact />
            {/* <Route path="/" element={<HomePage/>} exact /> */}

            {/* Public Routes */}
            <Route index element={<Public />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PersistLogin />}>
              
              <Route exact path="dash" element={<DashLayout/>}>
                <Route index element={<HomePage1 />} />
                <Route path="chats" element={<ChatPage/>} />
                <Route path="missing">
                  <Route index element={<MissingPage/>}/>
                  <Route path="locate" element={<MissingLocatePage/>}/>
                  <Route path="new" element={<NewMissingForm />}/>
                </Route>
                <Route path="found">
                  <Route path="new" element={<NewFoundForm/>}/>
                  <Route path="done" element={<DonePage/>}/>
                  <Route path="locate" element={<FoundLocatePage/>}/>
                </Route>
                <Route path='profile'>
                  <Route index element={<ProfilePageLoad/>}/>
                  <Route path='edit/:id' element={<ProfileEditLoad/>}/>
                </Route> 
              </Route>
            </Route>
          
          <Route path="admin" element={<Layout/>}>

            {/* Admin Public Routes */}
            <Route index element={<AdminPublic/>}/>
            <Route path="login" element={<AdminLogin />} />
            <Route element={<AdminPersistLogin/>}>

              <Route element={<AdminRequireAuth />}> 
                <Route exact path="dash" element={<AdminDashLayout/>}>
                  <Route index element={<AdminDash />} />

                  <Route path="reports" >
                    <Route index element={<AdminReportPage/>} />
                    <Route path='found' element={<AdminFoundReportPage/>} />
                    <Route path='found/new' element={<AdminNewFoundLoad/>} />
                    <Route path='found/:id' element={<AdminItemPage/>} />
                    <Route path='found/info' element={<AdminReportInfo/>} />
                    <Route path='claimed/' element={<AdminClaimedReciptLoad/>} />
                    <Route path='missing' element={<AdminMissingReportPage/>} />
                    <Route path='missing/new' element={<AdminNewMissingLoad/>} />
                    <Route path='missing/info' element={<AdminReportInfo/>} />
                    <Route path='found/edit/:id' element={<AdminEditFoundForm/>} />
                    <Route path='missing/edit/:id' element={<AdminEditMissingForm/>} />
                  </Route>
                  <Route path="messages" element={<AdminMessagesPage/>} />
                  <Route path="users">
                    <Route index element={<AdminUsersPage/>}/>
                    <Route path="edit/:id" element={<AdminEditUserLoad/>}/>
                    <Route path="new" element={<AdminNewUserForm />}/>
                  </Route>
                  <Route path="referenceNumber">
                    {/* <Route index element={<AdminReferenceNumberPage/>} /> */}
                    <Route index element={<AdminReferenceNumberPage/>} />
                    <Route path='download' element={<AdminDownloadReceipt/>} />
                    <Route path='info' element={<AdminClaimedReportInfo/>} />
                  </Route>
                </Route>
              </Route>
            </Route>

          </Route>
        
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ChatProvider>
    
  )
}

export default App;
