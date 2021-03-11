import React from 'react';
import tw from 'tailwind-styled-components';
import { PersonAdd } from "@styled-icons/evaicons-solid/PersonAdd";
import { useDispatch, useSelector } from 'react-redux';
import Prompt from './Prompt';
import promptActions from '../redux/actions/PromptAction';
import { prompt } from '../constants';
import useAddUserPrompt from '../custom-hooks/useAddUserPrompt';
import { Exit } from "@styled-icons/icomoon/Exit";
import useLeaveChatPrompt from '../custom-hooks/useLeaveChatPrompt';
import { RootState } from '../redux/reducers/allReducer';

const Header = tw.div`
    bg-white
    w-full
    px-8
    py-3
    flex
    justify-between
`;

const PersonAddIcon = tw(PersonAdd)`
    w-6 h-6
    cursor-pointer
    ml-4
`;
const LeaveChatIcon = tw(Exit)`
    w-6 h-6
    cursor-pointer
    ml-4
`;

/**
 * Custom hook for choosing which prompt to use.
 * 
 * @param {string} chatId Chat id. 
 * @returns {any} Prompt props.
 */
function usePrompt(chatId: string) {
    const { promptToOpen } = useSelector((state: RootState) => state.promptReducer);
    const prompts = {
        addUser: useAddUserPrompt(chatId),
        leaveChat: useLeaveChatPrompt(chatId)
    };
    let modal = prompts.addUser;

    if(promptToOpen === prompt.ADD_USERS) {
        modal = prompts.addUser;
    } else if(promptToOpen === prompt.LEAVE_CHAT) {
        modal = prompts.leaveChat;
    }

    return modal;
}

export default function ChatHeader({ chat }) {
    const dispatch = useDispatch();
    const modal = usePrompt(chat._id);
    const { user } = useSelector((state: RootState) => state.userReducer);

    return (
        <Header>
            <div>{chat.title}</div>
            <div>
                <PersonAddIcon onClick={() => dispatch(promptActions.show(prompt.ADD_USERS))} />
                {
                    chat.admin._id !== user._id &&
                        <LeaveChatIcon onClick={() => dispatch(promptActions.show(prompt.LEAVE_CHAT))} />
                }
            </div>
            <Prompt modal={modal} />
        </Header>
    );
}