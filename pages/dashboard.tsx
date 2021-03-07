import React, { useEffect, useReducer } from "react";
import ChatService from "../src/api/services/ChatService";
import userActions from "../src/redux/actions/UserAction";
import ChatList from "../src/views/ChatList";
import ChosenChat from "../src/views/ChosenChat";
import Sidenav from "../src/views/Sidenav";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/redux/reducers/allReducer";

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { chosenChatId, chats } = useSelector((state: RootState) => state.userReducer); 

    useEffect(() => {
        if(!chats)
            ChatService
                .getChats()
                .then(success => {
                    let { chats, _id, ...rest } = success.data;
                    chats = chats.map(chat => {
                        const lastMsg = chat.messages[chat.messages.length - 1];
                        const { message, userId } = lastMsg;
                        return {
                            ...chat, 
                            latestMsg: `${(userId._id === _id) ? "You" : userId.username}: ${message}`,
                            onClick: () => dispatch(userActions.chooseChat(chat._id)),
                        };
                    });
                    dispatch(userActions.setAll({_id, ...rest}, chats, null, ""));
                })
                .catch(error => console.log(error.response));
    }, [chats]);

    return (
        <div className="flex w-full h-full bg-gray-50">
            <Sidenav />
            <ChatList chats={chats ? chats : []} />
            <ChosenChat chatId={chosenChatId} />
        </div>
    );
}