import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/allReducer";
import useAddUserPrompt from "./useAddUserPrompt";
import useDeleteChatPrompt from "./useDeleteChatPrompt";
import useLeaveChatPrompt from "./useLeaveChatPrompt";
import useUpdateChatPrompt from "./useUpdateChatPrompt";
import { prompt } from "../constants";
import { CurrentChat } from "../views/ChosenChat";

/**
 * Custom hook for choosing which prompt to use.
 * 
 * @param {any} chat Chosen chat. 
 * @returns {any} Prompt props.
 */
export default function usePrompt(chat: CurrentChat) {
    const { promptToOpen } = useSelector((state: RootState) => state.promptReducer);
    const { _id } = chat;
    const prompts = {
        addUser: useAddUserPrompt(_id),
        leaveChat: useLeaveChatPrompt(_id),
        updateChat: useUpdateChatPrompt(chat),
        deleteChat: useDeleteChatPrompt(_id)
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