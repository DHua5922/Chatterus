import React, { useContext, useEffect, useState } from "react";
import ChatService from "../src/api/services/ChatService";
import userActions from "../src/redux/actions/UserAction";
import ChatList from "../src/views/ChatList";
import ChosenChat from "../src/views/ChosenChat";
import Sidenav from "../src/views/Sidenav";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/redux/reducers/allReducer";
import { AddCircle } from "@styled-icons/ionicons-sharp/AddCircle";
import tw from "tailwind-styled-components";
import promptActions from "../src/redux/actions/PromptAction";
import Prompt from "../src/views/Prompt";
import loadActions from "../src/redux/actions/LoadAction";
import Loading from "../src/views/Loading";
import { prompt } from "../src/constants";
import { Socket } from "socket.io-client";
import { SocketContext } from "../src/context/socket";

const AddCircleIcon = tw(AddCircle)`
    h-16
    absolute
    text-blue-500
    cursor-pointer
    bottom-4
    right-4
`;

const ListContainer = tw.div`
    w-1/6
    border-r
    border-l
    relative
`;

const CreateChatButton = tw.button`
    text-white 
    py-2 px-4 
    rounded-sm 
    bg-blue-500
`;

/**
 * Gets the most recent message in the chat.
 * 
 * @param {any[]} messages Chat messages.
 * @param {string} userAccountId User id.
 * @returns {string} Most recent message in the chat.
 */
function getLatestMessage(messages, userAccountId: string): string {
    let latestMsg = "";
    const lastMsg = messages[messages.length - 1];
    if(lastMsg) {
        const { message, userId } = lastMsg;
        latestMsg = `${(userId._id === userAccountId) ? "You" : userId.username}: ${message}`;
    }
    return latestMsg;
}

/**
 * Custom hook for responses to creating new chat.
 * 
 * @param {string} userId User id. 
 * @return {any} Create chat events.
 */
function useCreateChatResponses(userId: string) {
    const dispatch = useDispatch();
    
    /**
     * Response to successfully creating chat.
     * 
     * @param {any[]} chats Chat list.
     * @param {any} newChat Created chat. 
     */
    function onCreateChat(chats: any[], newChat: any) {
        const newChatPreview = {
            ...newChat,
            latestMsg: getLatestMessage(newChat.messages, userId),
            onClick: () => dispatch(userActions.chooseChat(newChat._id))
        };
        dispatch(userActions.setChats([...chats, newChatPreview]));
        dispatch(loadActions.success("Chat created."))
        dispatch(promptActions.close());
        dispatch(userActions.chooseChat(newChat._id));
    }
    
    /**
     * Response to error in creating chat.
     * 
     * @param {any} error Error response.
     */
    function onCreateChatError(error) {
        let errorMsg: string = "Cannot create chat.";
        if(error.response && error.response.status === 400) {
            errorMsg = error.response.data.message;
        }
        dispatch(loadActions.fail(errorMsg));
    }

    /**
     * Response to attempt to creating new chat.
     * 
     * @param {string} chatName Chat name.
     * @return {Promise<AxiosResponse<any>>}
     */
     function onCreatingChat(chatName: string) {
        dispatch(loadActions.pending());
        return ChatService.createChat(userId, chatName);
    }
    
    return { onCreateChat, onCreateChatError, onCreatingChat };
}

/**
 * Custom hook for getting user information and chats.
 * 
 * @returns {any} User information and chats.
 */
function useChats() {
    const { chats, user, chosenChatId } = useSelector((state: RootState) => state.userReducer);
    const dispatch = useDispatch();

    /**
     * Response to successfully getting chats.
     * 
     * @param {AxiosResponse<any>} success Success response.
     */
    function onGetChats(success) {
        const { chats, _id, ...rest } = success.data;
        dispatch(userActions.setAll({_id, ...rest}, chats, null, ""));
    }

    /**
     * Get user information and chats when
     * loading page.
     */
    useEffect(() => {
        if(!chats)
            ChatService
                .getChats()
                .then(success => onGetChats(success))
                .catch(error => console.log(error.response));
    }, [chats]);

    return { chats, user, chosenChatId };
}

/**
 * Custom hook for creating prompt for prompting users to
 * create a new chat.
 * 
 * @param {string} userId User id.
 * @param {any[]} chats Chat list.
 * @returns {any} Modal props.
 */
function useModal(userId : string, chats: any[]) {
    const dispatch = useDispatch();
    const { open, promptToOpen } = useSelector((state: RootState) => state.promptReducer);
    const { success, error, isPending } = useSelector((state: RootState) => state.loadReducer);
    const [chatName, setChatName] = useState("");
    const { onCreateChat, onCreateChatError, onCreatingChat } = useCreateChatResponses(userId);

    /**
     * Response to clicking on button for creating a new chat.
     * 
     * @param {string} chatName Chat name.
     */
     function onClickCreateChatButton(chatName: string) {
        onCreatingChat(chatName)
            .then(success => onCreateChat(chats, success.data))
            .catch(error => onCreateChatError(error)); 
    }

    const props = {
        open: open && promptToOpen === prompt.CREATE_CHAT,
        onClose: () => dispatch(promptActions.close())
    };
    const header = {
        children: "Create Chat"
    };
    const body = {
        children: <input 
            placeholder={"Enter chat name"} 
            value={chatName} 
            onChange={(evt) => setChatName(evt.target.value)}
            className={"py-2 px-4 border-black border w-full outline-none bg-gray-50"} 
        />
    };
    const footer = {
        props: {},
        children: <div className="flex justify-center">
            <CreateChatButton 
                onClick={() => onClickCreateChatButton(chatName)} 
            >
                Create Chat
            </CreateChatButton>
        </div>
    };
    const message = {
        success: success,
        error: error,
        pending: {
            isPending: isPending,
            message: "Creating chat..."
        }
    };

    return { props, header, body, footer, message };
}

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { chosenChatId, chats, user } = useChats();
    const modal = useModal(
        user ? user._id : "", 
        chats ? chats: []
    );
    
    let componentToRender;
    if(!chats) {
        // Loading user information and chats
        componentToRender = <div className="m-auto"><Loading /></div>;
    } else {
        // Loaded user information and chats
        
        const socket: Socket = useContext(SocketContext);
        socket.on("ON_JOIN_CHAT", (data) => {
            // After being added to chat, update chat preview list
            const { invitedUsernameList, chat } = data;
            const isInvited = invitedUsernameList.some(username => user.username === username);
            const isAlreadyInChatList = chats.some(existingChat => existingChat._id === chat._id);
            if(isInvited && !isAlreadyInChatList) {
                dispatch(userActions.setChats([...chats, chat]))
            }
        });

        // Display user information and chats
        const chatPreviewList = chats.map(chat => {
            return {
                ...chat,
                latestMsg: getLatestMessage(chat.messages, user._id),
                onClick: () => dispatch(userActions.chooseChat(chat._id))
            };
        });
        componentToRender = (
            <>
                <ListContainer>
                    <ChatList chats={chatPreviewList} />
                    <AddCircleIcon onClick={() => dispatch(promptActions.show(prompt.CREATE_CHAT))} />
                </ListContainer>
                <ChosenChat chatId={chosenChatId} />
                <Prompt 
                    modal={modal} 
                />
            </>
        );
    }
    
    return (
        <div className="flex w-full h-full bg-gray-50">
            <Sidenav />
            {componentToRender}
        </div>
    );
}