import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/allReducer";
import useAddUserPrompt from "./useAddUserPrompt";
import useDeleteChatPrompt from "./useDeleteChatPrompt";
import useLeaveChatPrompt from "./useLeaveChatPrompt";
import useUpdateChatPrompt from "./useUpdateChatPrompt";
import { prompt } from "../constants";

/**
 * Custom hook for choosing which prompt to use.
 * 
 * @param {any} chat Chosen chat. 
 * @returns {any} Prompt props.
 */
export default function usePrompt(chat: any) {
    const { promptToOpen } = useSelector((state: RootState) => state.promptReducer);
    const prompts = {
        addUser: useAddUserPrompt(chat._id),
        leaveChat: useLeaveChatPrompt(chat._id),
        updateChat: useUpdateChatPrompt(chat),
        deleteChat: useDeleteChatPrompt(chat)
    };
    let modal = prompts.addUser;

    if(promptToOpen === prompt.ADD_USERS) {
        modal = prompts.addUser;
    } else if(promptToOpen === prompt.LEAVE_CHAT) {
        modal = prompts.leaveChat;
    } else if(promptToOpen === prompt.UPDATE_CHAT) {
        modal = prompts.updateChat;
    } else if(promptToOpen === prompt.DELETE_CHAT) {
        modal = prompts.deleteChat;
    }

    return modal;
}