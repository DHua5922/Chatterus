import React, { useEffect, useReducer } from "react";
import ChatService from "../src/api/services/ChatService";
import userActions from "../src/redux/actions/UserAction";
import UserReducer, { initialUserState } from "../src/redux/reducers/UserReducer";
import ChatList from "../src/views/ChatList";
import ChosenChat from "../src/views/ChosenChat";

export default function DashboardPage() {
    const [userInfo, dispatchUserInfo] = useReducer(UserReducer, initialUserState);

    useEffect(() => {
        if(!userInfo.chats)
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
                        };
                    });
                    dispatchUserInfo(userActions.setAll({_id, ...rest}, chats, null));
                })
                .catch(error => console.log(error.response));
    }, [userInfo.chats]);

    return (
        <div className="flex w-full h-full">
            <ChatList chats={userInfo.chats ? userInfo.chats : []} />
            <ChosenChat chat={userInfo.chosenChat} />
        </div>
    );
}