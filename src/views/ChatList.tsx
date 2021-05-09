import { useEffect } from "react";
import { useDispatch } from "react-redux";
import tw from "tailwind-styled-components";
import { getLatestMessage, socketEvents } from "../constants";
import { socket } from "../context/socket";
import useChats from "../custom-hooks/useChats";
import loadActions from "../redux/actions/LoadAction";
import promptActions from "../redux/actions/PromptAction";
import userActions from "../redux/actions/UserAction";

const RecentMessage = tw.small`
    ${props => props.textColor || "text-gray-500"}
`;

const Chat = tw.div`
    py-4 
    px-16 
    border-b
    hover:bg-gray-50 
    cursor-pointer
    whitespace-nowrap
    overflow-ellipsis
    overflow-hidden
`;

function ChatPreview({ title, latestMsg, onClick }) {
    return (
        <Chat onClick={onClick}>
            <h1>{title}</h1>
            <RecentMessage>
                {latestMsg}
            </RecentMessage>
        </Chat>
    );
}

export default function ChatList({ chats }) {
    const dispatch = useDispatch();
    const userInfo = useChats();
    const { 
        NON_ADMIN_UPDATE_CHAT, 
        ON_JOIN_CHAT, 
        SEND_MESSAGE_SUCCESS, 
        ON_DELETE_CHAT_ADMIN, 
        ON_DELETE_CHAT_NON_ADMIN 
    } = socketEvents;

    useEffect(() => {
        socket.on(NON_ADMIN_UPDATE_CHAT, (updatedChat) => {
            // Update the chat list with the updated chat
            chats.some((existingChat, index: number) => {
                if(existingChat._id === updatedChat._id){
                    dispatch(userActions.setChats([
                        ...chats.slice(0, index),
                        updatedChat,
                        ...chats.slice(index + 1)
                    ]));
                    return true;
                }
                return false;
            });
        });

        socket.on(ON_JOIN_CHAT, (data) => {
            // After being added to chat, update chat preview list
            const { invitedUsernameList, chat } = data;
            const isInvited = invitedUsernameList.some(username => userInfo.user.username === username);
            const isAlreadyInChatList = chats.some(existingChat => existingChat._id === chat._id);
            if(isInvited && !isAlreadyInChatList) {
                dispatch(userActions.setChats([...chats, chat]));
            }
        });

        socket.on(SEND_MESSAGE_SUCCESS, (updatedChat) => {
            dispatch(userActions.setChats(
                // Update chat list to display new message as latest message
                chats.map(chat => (updatedChat._id === chat._id) 
                    ?   { 
                            ...chat, 
                            latestMsg: getLatestMessage(updatedChat.messages, userInfo.user._id) 
                        }
                    : chat
                )
            ));
        });

        socket.on(ON_DELETE_CHAT_ADMIN, (chatId: string) => {
            dispatch(loadActions.success(""));
            dispatch(promptActions.close());
            dispatch(userActions.setAll(
                userInfo.user,
                chats.filter(chat => chat._id !== chatId),
                null,
                "",
            ));
        });

        socket.on(ON_DELETE_CHAT_NON_ADMIN, (chatId: string) => {
            dispatch(userActions.setAll(
                userInfo.user,
                chats.filter(chat => chat._id !== chatId),
                (userInfo.chosenChat && userInfo.chosenChat._id === chatId) ? null : userInfo.chosenChat,
                "",
            ));
        });

        () => socket.close();
    }, []);

    return (
        <>
            { chats.map(chat => <ChatPreview {...chat} />) }
        </>
    );
}