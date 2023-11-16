import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const { userInfo } = useAuth

    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedReport, setSelectedReport] = useState();

    // const history = useHistory();
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        console.log(`user chat provider`, {user})
        // if (!userInfo) navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return (
        <ChatContext.Provider
        value={{
            selectedChat,
            setSelectedChat,
            user,
            setUser,
            notification,
            setNotification,
            chats,
            setChats,
            selectedReport,
            setSelectedReport,
        }}
        >
        {children}
        </ChatContext.Provider>
    );
    };

    export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
