import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-styled-components";
import ChatService from "../api/services/ChatService";
import loadActions from "../redux/actions/LoadAction";
import promptActions from "../redux/actions/PromptAction";
import userActions from "../redux/actions/UserAction";
import { RootState } from "../redux/reducers/allReducer";
import { prompt } from "../constants";
import { Chat } from "../redux/reducers/UserReducer";
import { PromptState } from "../redux/reducers/PromptReducer";

const CreateChatButton = tw.button`
    text-white 
    py-2 px-4 
    rounded-sm 
    bg-blue-500
`;

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
     * @param {Chat[]} chats Chat list.
     * @param {Chat} newChat Created chat. 
     */
    function onCreateChat(chats: Chat[], newChat: Chat) {
        dispatch(userActions.setChatList([...chats, newChat]));
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
 * Custom hook for creating prompt for prompting users to
 * create a new chat.
 * 
 * @param {string} userId User id.
 * @param {Chat[]} chats Chat list.
 * @returns {any} Prompt props.
 */
export default function useCreateChatPrompt(userId : string, chats: Chat[]) {
    const dispatch = useDispatch();
    const { open, promptToOpen }: PromptState = useSelector((state: RootState) => state.promptReducer);
    const { success, error, isPending } = useSelector((state: RootState) => state.loadReducer);
    const [chatName, setChatName] = useState("" as string);
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