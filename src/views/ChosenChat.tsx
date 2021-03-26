import tw from "tailwind-styled-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useEffect, useState } from "react";
import { RootState } from "../redux/reducers/allReducer";
import ChatService from "../api/services/ChatService";
import userActions from "../redux/actions/UserAction";
import { format } from "date-fns";
import ChatHeader from "./ChatHeader";
import { Socket } from "socket.io-client";
import { socket, SocketContext } from "../context/socket";
import loadActions from "../redux/actions/LoadAction";
import { socketEvents } from "../constants";

const PromptContainer = tw.div`
    w-full 
    flex
`;
const Prompt = tw.div`
    text-xl
    m-auto
`;

const ChatContainer = tw.div`
    w-4/6 
    relative 
    border-r
    min-w-330px
`;

const Chat = tw.div`
    overflow-y-auto
    absolute
    w-full
    top-50px
    bottom-60px
`;
const MessageInput = tw.input`
    p-4
    w-full
    rounded
    border
    outline-none
    absolute
    bottom-0
`;

const MessageContainer = tw.div`
    py-4
    px-10
    ${props => props.backgroundColor || ""}
`;
const Username = tw.div`
    text-xs 
    text-gray-500
`;
const MessageDate = tw.div`
    text-xs 
    font-thin 
    text-gray-600
`;

function MessageDisplay({ userId, message, createdAt, loggedInUserId }) {
    const { _id, username } = userId;
    return (
        <MessageContainer backgroundColor={(_id === loggedInUserId) && "bg-blue-200"}>
            <Username>{username}</Username>
            <div className="py-1">{message}</div>
            <MessageDate>
                {format(new Date(createdAt), "PP, p")}
            </MessageDate>
        </MessageContainer>
    );
}

function SendMessageInput({ userId, chatId }) {
    const socket: Socket = useContext(SocketContext);
    const [message, setMessage] = useState("" as string);

    function onSubmit(evt) {
        evt.preventDefault();
        socket.emit("SENDING_MESSAGE", { userId, chatId, message: message });
    }

    return (
        <form onSubmit={onSubmit}>
            <MessageInput 
                placeholder="Enter message" 
                onChange={(evt) => setMessage(evt.target.value)}
                value={message}
            />
        </form>
    );
}

export default function ChosenChat({ chatId }) {
    const { chosenChat, user } = useSelector((state: RootState) => state.userReducer);
    const dispatch = useDispatch();
    const { 
        DELETE_CHAT_ERROR, 
        NON_ADMIN_UPDATE_CHAT, 
        SEND_MESSAGE_SUCCESS 
    } = socketEvents;

    useEffect(() => {
        socket.on(DELETE_CHAT_ERROR, (error) => {
            dispatch(loadActions.fail(error.message));
        });

        () => socket.close();
    }, []);

    useEffect(() => {
        socket.on(NON_ADMIN_UPDATE_CHAT, (updatedChat) => {
            // If the non-admin user is viewing the same 
            // updated chat as admin, update the chat view
            if(chosenChat && chosenChat._id === updatedChat._id) {
                dispatch(userActions.setChosenChat(updatedChat));
            }
        });

        socket.on(SEND_MESSAGE_SUCCESS, (updatedChat) => {
            if(chosenChat && chosenChat._id === updatedChat._id) {
                // If user is seeing chat where a new 
                // message was sent, display that message
                dispatch(userActions.setChosenChat(updatedChat))
            }
        });

        () => socket.close();
    }, [chosenChat]);

    useEffect(() => {
        if(chatId) {
            ChatService
                .getChat(chatId)
                .then(response => {
                    dispatch(userActions.setChosenChat(response.data));
                });
        }
    }, [chatId]);

    if(!chosenChat)
        return (
            <PromptContainer>
                <Prompt>
                    Choose a chat and start a conversation.
                </Prompt>
            </PromptContainer>
        );

    const { messages } = chosenChat;
    return (
        <ChatContainer>
            <ChatHeader chat={chosenChat} />
            
            <Chat>
                <div>
                    { 
                        messages.map(message => (
                            <MessageDisplay 
                                {...message} 
                                loggedInUserId={user._id} 
                            />
                        )) 
                    }
                </div>
            </Chat>

            <SendMessageInput 
                userId={user._id}
                chatId={chatId} 
            />
        </ChatContainer>
    );
}