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
import { Message, User, UserState } from "../redux/reducers/UserReducer";
import { AxiosResponse } from "axios";

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

const ChatPanel = tw.div`
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
    border-2
    border-black
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

function MessageDisplay(
    { userId, createdAt, message, ...props }: 
        { userId: User, createdAt: string, message: string }
) {
    const { user }: UserState = useSelector((state: RootState) => state.userReducer)
    const { _id, username } = userId;
    return (
        <MessageContainer backgroundColor={(_id === user._id) && "bg-blue-200"} {...props}>
            <Username>{username}</Username>
            <div className="py-1">{message}</div>
            <MessageDate>
                {format(new Date(createdAt), "PP, p")}
            </MessageDate>
        </MessageContainer>
    );
}

function SendMessageInput(
    { userId, chatId }: 
        { userId: string, chatId: string }
) {
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

interface CurrentChat {
    admin: User
    createdAt: string
    messages: Message[]
    title: string
    _id: string
}

interface Props {
    chatId: string
}

function ChosenChat({ chatId }: Props) {
    const dispatch = useDispatch();
    const { user }: UserState = useSelector((state: RootState) => state.userReducer);
    const { 
        DELETE_CHAT_ERROR, 
        NON_ADMIN_UPDATE_CHAT, 
        SEND_MESSAGE_SUCCESS,
        ON_DELETE_CHAT_ADMIN,
        ON_DELETE_CHAT_NON_ADMIN,
    } = socketEvents;

    const [chat, setChat] = useState(null as CurrentChat);

    useEffect(() => {
        socket.on(DELETE_CHAT_ERROR, (error) => {
            dispatch(loadActions.fail(error.message));
        });

        () => socket.close();
    }, []);

    useEffect(() => {
        socket.on(NON_ADMIN_UPDATE_CHAT, (updatedChat: CurrentChat) => {
            // If the non-admin user is viewing the same 
            // updated chat as admin, update the chat view
            if(chat && chat._id === updatedChat._id) {
                setChat(updatedChat);
            }
        });

        socket.on(SEND_MESSAGE_SUCCESS, (updatedChat: CurrentChat) => {
            if(chat && chat._id === updatedChat._id) {
                // If user is seeing chat where a new 
                // message was sent, display that message
                setChat(updatedChat);
            }
        });

        socket.on(ON_DELETE_CHAT_ADMIN, () => {
            dispatch(loadActions.success(""));
            setChat(null);
            dispatch(userActions.chooseChat(""));
        });

        socket.on(ON_DELETE_CHAT_NON_ADMIN, (deletedChatId: string) => {
            setChat((deletedChatId === chatId) ? null : chat);
            dispatch(userActions.chooseChat((deletedChatId === chatId) ? "" : chatId));
        });

        () => socket.close();
    }, [chat]);

    useEffect(() => {
        if(chatId) {
            ChatService
                .getChat(chatId)
                .then(({ data }: AxiosResponse<any>) => setChat(data as CurrentChat));
        }
    }, [chatId]);

    if(!chat)
        return (
            <PromptContainer>
                <Prompt>
                    Choose a chat and start a conversation.
                </Prompt>
            </PromptContainer>
        );

    return (
        <ChatContainer>
            <ChatHeader chat={chat} />
            <ChatPanel>
                { 
                    chat.messages.map(({ _id, ...rest }: Message) => (
                        <MessageDisplay 
                            key={_id}
                            {...rest} 
                        />
                    )) 
                }
            </ChatPanel>
            <SendMessageInput userId={user._id} chatId={chatId} />
        </ChatContainer>
    );
}

export type { CurrentChat }
export default ChosenChat;