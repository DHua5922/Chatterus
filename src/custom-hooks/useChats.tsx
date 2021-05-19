import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatService from "../api/services/ChatService";
import loadActions from "../redux/actions/LoadAction";
import userActions from "../redux/actions/UserAction";
import { RootState } from "../redux/reducers/allReducer";
import { UserState } from "../redux/reducers/UserReducer";

/**
 * Custom hook for getting user information and chats.
 * 
 * @returns {any} User information and chats.
 */
export default function useChats(): UserState {
    const { chats, user, chosenChatId }: UserState = useSelector((state: RootState) => state.userReducer);
    const dispatch = useDispatch();

    /**
     * Response to successfully getting chats.
     * 
     * @param {AxiosResponse<any>} success Success response.
     */
    function onGetChats({ data }: AxiosResponse<any>) {
        const { chats, ...rest } = data;
        dispatch(loadActions.success(""))
        dispatch(userActions.setAll({...rest}, chats, ""));
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

    return { chats, user, chosenChatId };
}