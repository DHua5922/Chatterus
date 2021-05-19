import React, { useContext, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/allReducer';
import promptActions from '../redux/actions/PromptAction';
import { SocketContext } from '../context/socket';
import { Socket } from 'socket.io-client';
import loadActions from '../redux/actions/LoadAction';
import { prompt } from '../constants';
import userActions from '../redux/actions/UserAction';
import { PromptState } from '../redux/reducers/PromptReducer';
import { Chat, UserState } from '../redux/reducers/UserReducer';

const PromptButton = tw.button`
    bg-red-600
    px-4 py-2
    text-white
    rounded-sm
`;

/**
 * Custom hook for creating prompt for inviting users to chat.
 * 
 * @param {string} chatId Id of chat to invite user to. 
 * @returns {any} Prompt props.
 */
export default function useLeaveChatPrompt(chatId: string) {
    const dispatch = useDispatch();
    const { open, promptToOpen }: PromptState = useSelector((state: RootState) => state.promptReducer);
    const { success, error, isPending } = useSelector((state: RootState) => state.loadReducer);
    const { user, chats }: UserState = useSelector((state: RootState) => state.userReducer);
    const socket: Socket = useContext(SocketContext);

    function onLeavingChat(userId: string, chatId: string) {
        socket.emit("LEAVING_CHAT", { userId, chatId });
        dispatch(loadActions.pending());
    }

    useEffect(() => {
        socket.on("LEAVE_CHAT_ERROR", (error: string) => {
            dispatch(loadActions.fail(error));
        });
    
        socket.on("LEAVE_CHAT", (chatId: string) => {
            dispatch(loadActions.success(""));
            dispatch(promptActions.close());
            dispatch(userActions.setAll(
                user,
                chats.filter(({ _id }: Chat) => _id !== chatId),
                "",
            ));
        });

        () => socket.disconnect();
    }, []);

    const props = {
        open: open && promptToOpen === prompt.LEAVE_CHAT,
        onClose: () => dispatch(promptActions.close())
    };
    const header = {
        children: "Leave chat?"
    };
    const body = {
        children: <p>Are you sure you want to leave this chat?</p>
    };
    const footer = {
        props: {},
        children: <div className="flex justify-center">
            <PromptButton 
                onClick={() => onLeavingChat(user._id, chatId)} 
            >
                Leave chat
            </PromptButton>
        </div>
    };
    const message = {
        success: success,
        error: error,
        pending: {
            isPending: isPending,
            message: "Leaving chat..."
        }
    };

    return { props, header, body, footer, message };
}