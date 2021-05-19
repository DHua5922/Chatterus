import React, { useContext } from 'react';
import tw from 'tailwind-styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/allReducer';
import promptActions from '../redux/actions/PromptAction';
import { SocketContext } from '../context/socket';
import { Socket } from 'socket.io-client';
import loadActions from '../redux/actions/LoadAction';
import { prompt } from '../constants';
import { PromptState } from '../redux/reducers/PromptReducer';

const PromptButton = tw.button`
    bg-red-600
    px-4 py-2
    text-white
    rounded-sm
`;

/**
 * Custom hook for creating prompt to delete chat.
 * 
 * @param {string} chatId id of chat to delete. 
 * @returns {any} Prompt props.
 */
export default function useDeleteChatPrompt(chatId: string) {
    const dispatch = useDispatch();
    const { open, promptToOpen }: PromptState = useSelector((state: RootState) => state.promptReducer);
    const { success, error, isPending } = useSelector((state: RootState) => state.loadReducer);
    const socket: Socket = useContext(SocketContext);

    /**
     * Response for trying to delete chat.
     * 
     * @param {string} chatId Chat id. 
     */
    function onDeletingChat(chatId: string) {
        socket.emit("DELETING_CHAT", chatId);
        dispatch(loadActions.pending());
    }

    const props = {
        open: open && promptToOpen === prompt.DELETE_CHAT,
        onClose: () => dispatch(promptActions.close())
    };
    const header = {
        children: "Delete chat?"
    };
    const body = {
        children: <p>Are you sure you want to delete this chat?</p>
    };
    const footer = {
        props: {},
        children: <div className="flex justify-center">
            <PromptButton 
                onClick={() => onDeletingChat(chatId)} 
            >
                Delete chat
            </PromptButton>
        </div>
    };
    const message = {
        success: success,
        error: error,
        pending: {
            isPending: isPending,
            message: "Deleting chat..."
        }
    };

    return { props, header, body, footer, message };
}