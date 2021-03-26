import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatService from "../api/services/ChatService";
import userActions from "../redux/actions/UserAction";
import { RootState } from "../redux/reducers/allReducer";

/**
 * Custom hook for getting user information and chats.
 * 
 * @returns {any} User information and chats.
 */
export default function useChats() {
    const { chats, user, chosenChatId, chosenChat } = useSelector((state: RootState) => state.userReducer);
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
        ChatService
            .getChats()
            .then(success => onGetChats(success))
            .catch(error => console.log(error.response));
    }, []);

    return { chats, user, chosenChatId, chosenChat };
}