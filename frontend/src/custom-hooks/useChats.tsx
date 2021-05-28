import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ChatService from "../api/services/ChatService";
import loadActions from "../redux/actions/LoadAction";
import userActions from "../redux/actions/UserAction";
import { Chat } from "../redux/reducers/UserReducer";

/**
 * Custom hook for getting user's chats.
 * 
 * @returns {Chat[]} User's chats.
 */
export default function useChats() {
    const dispatch = useDispatch();

    /**
     * Response to successfully getting chats.
     * 
     * @param {AxiosResponse<any>} success Success response.
     */
    function onGetChats({ data }: AxiosResponse<any>) {
        const { chats, ...rest } = data;
        dispatch(loadActions.success(""))
        dispatch(userActions.setUser({...rest}));
        dispatch(userActions.setChats(chats));
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
}