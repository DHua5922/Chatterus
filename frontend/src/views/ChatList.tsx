import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-styled-components";
import { socketEvents } from "../constants";
import { socket } from "../context/socket";
import loadActions from "../redux/actions/LoadAction";
import promptActions from "../redux/actions/PromptAction";
import userActions from "../redux/actions/UserAction";
import { RootState } from "../redux/reducers/allReducer";
import { Chat } from "../redux/reducers/UserReducer";

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

function usePreviewFormat(chats: Chat[], input: string): ChatDisplay[] {
    const dispatch = useDispatch();
    return chats.map((chat: Chat) => {
        return {
            ...chat,
            onClick: () => dispatch(userActions.chooseChat(chat._id))
        };
    }).filter((chat: ChatDisplay) => {
        const chatTitleToCheck = chat.title.trim().toLowerCase();
        const desiredChatTitle = input.trim().toLowerCase();
        return chatTitleToCheck.includes(desiredChatTitle);
    });
}

export default function ChatList({ input }: Props) {
    const dispatch = useDispatch();
    const { user, chats, chosenChatId } = useSelector((state: RootState) => state.userReducer);
    const { 
        NON_ADMIN_UPDATE_CHAT, 
        ON_JOIN_CHAT, 
        ON_DELETE_CHAT_ADMIN, 
        ON_DELETE_CHAT_NON_ADMIN,
        ADMIN_UPDATE_CHAT,
    } = socketEvents;
    
    useEffect(() => {
        socket.on(NON_ADMIN_UPDATE_CHAT, (updatedChat: Chat) => {
            // Update the chat list with the updated chat
            chats.some((existingChat: Chat) => {
                if(existingChat._id === updatedChat._id){
                    dispatch(userActions.updateChat(updatedChat));
                    return true;
                }
                return false;
            });
        });

        socket.on(ON_JOIN_CHAT, ({ invitedUsernameList, chat }: { invitedUsernameList: string[], chat: Chat }) => {
            // After being added to chat, update chat preview list
            const { _id } = chat;
            const isInvited: boolean = invitedUsernameList.some(username => user.username === username);
            const isAlreadyInChatList: boolean = chats.some((existingChat: Chat) => existingChat._id === _id);
            if(isInvited && !isAlreadyInChatList) {
                dispatch(userActions.addChat(chat));
            }
        });

        socket.on(ON_DELETE_CHAT_ADMIN, (chatId: string) => {
            dispatch(loadActions.success(""));
            dispatch(promptActions.close());
            dispatch(userActions.removeChat(chatId));
            dispatch(userActions.chooseChat(""));
        });

        socket.on(ON_DELETE_CHAT_NON_ADMIN, (chatId: string) => {
            dispatch(userActions.removeChat(chatId));
            dispatch(userActions.chooseChat((chosenChatId === chatId) ? "" : chosenChatId));
        });

        socket.on(ADMIN_UPDATE_CHAT, (updatedChat: Chat) => {
            // Updates the chat for the admin's list
            dispatch(userActions.updateChat(updatedChat));
        });

        () => socket.close();
    }, []);

    return (
        <>
            { 
                usePreviewFormat(chats, input).map((chatPreview: ChatDisplay) => (
                    <ChatPreview 
                        key={chatPreview._id} 
                        {...chatPreview} 
                    />
                )) 
            }
        </>
    );
}