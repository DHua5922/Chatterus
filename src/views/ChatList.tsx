import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-styled-components";
import { getLatestMessage, socketEvents } from "../constants";
import { socket } from "../context/socket";
import loadActions from "../redux/actions/LoadAction";
import promptActions from "../redux/actions/PromptAction";
import userActions from "../redux/actions/UserAction";
import { RootState } from "../redux/reducers/allReducer";
import { Chat } from "../redux/reducers/UserReducer";

const RecentMessage = tw.small`
    ${props => props.textColor || "text-gray-500"}
`;

const Display = tw.div`
    py-4 
    px-16 
    border-b
    hover:bg-gray-50 
    cursor-pointer
    whitespace-nowrap
    overflow-ellipsis
    overflow-hidden
`;

interface ChatDisplay {
    _id: string
    title: string
    onClick: Function
}

function ChatPreview({ title, onClick, ...props }: ChatDisplay) {
    return (
        <Display onClick={onClick} {...props}>
            <h1>{title}</h1>
        </Display>
    );
}

interface Props {
    input: string
}

export default function ChatList({ input }: Props) {
    const dispatch = useDispatch();
    const { chats, user, chosenChatId } = useSelector((state: RootState) => state.userReducer);
    const { 
        NON_ADMIN_UPDATE_CHAT, 
        ON_JOIN_CHAT, 
        SEND_MESSAGE_SUCCESS, 
        ON_DELETE_CHAT_ADMIN, 
        ON_DELETE_CHAT_NON_ADMIN 
    } = socketEvents;

    const list: ChatDisplay[] = chats.map((chat: Chat) => {
        return {
            ...chat,
            latestMsg: getLatestMessage(chat.messages, user._id),
            onClick: () => dispatch(userActions.chooseChat(chat._id))
        };
    }).filter((chat: ChatDisplay) => {
        const chatTitleToCheck = chat.title.trim().toLowerCase();
        const desiredChatTitle = input.trim().toLowerCase();
        return chatTitleToCheck.includes(desiredChatTitle);
    });
    
    useEffect(() => {
        socket.on(NON_ADMIN_UPDATE_CHAT, (updatedChat: Chat) => {
            // Update the chat list with the updated chat
            chats.some((existingChat: Chat, index: number) => {
                if(existingChat._id === updatedChat._id){
                    dispatch(userActions.setChatList([
                        ...chats.slice(0, index),
                        {
                            ...existingChat,
                            title: updatedChat.title
                        },
                        ...chats.slice(index + 1)
                    ]));
                    return true;
                }
                return false;
            });
        });

        socket.on(ON_JOIN_CHAT, ({ invitedUsernameList, chat }: { invitedUsernameList: string[], chat: Chat }) => {
            // After being added to chat, update chat preview list
            const isInvited = invitedUsernameList.some(username => user.username === username);
            const isAlreadyInChatList = chats.some((existingChat: Chat) => existingChat._id === chat._id);
            if(isInvited && !isAlreadyInChatList) {
                dispatch(userActions.setChatList([...chats, chat]))
            }
        });

        socket.on(SEND_MESSAGE_SUCCESS, (updatedChat: Chat) => {
            dispatch(userActions.setChatList(chats.map((chat: Chat) => {
                if(updatedChat._id === chat._id) { 
                    return updatedChat;
                }
                return chat;
            })));
        });

        socket.on(ON_DELETE_CHAT_ADMIN, (chatId: string) => {
            dispatch(loadActions.success(""));
            dispatch(promptActions.close());
            dispatch(userActions.setChatList(chats.filter(({ _id }: Chat) => _id !== chatId)));
            dispatch(userActions.chooseChat(""));
        });

        socket.on(ON_DELETE_CHAT_NON_ADMIN, (chatId: string) => {
            dispatch(userActions.setChatList(chats.filter(({ _id }: Chat) => _id !== chatId)));
            dispatch(userActions.chooseChat((chosenChatId === chatId) ? "" : chosenChatId));
        });

        () => socket.close();
    }, []);

    return (
        <>
            { 
                list.map((chatPreview: ChatDisplay) => (
                    <ChatPreview 
                        key={chatPreview._id} 
                        {...chatPreview} 
                    />
                )) 
            }
        </>
    );
}