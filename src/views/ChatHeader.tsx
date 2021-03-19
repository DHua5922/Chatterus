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
import useUpdateChatPrompt from '../custom-hooks/useUpdateChatPrompt';
import { Edit } from "@styled-icons/entypo/Edit";
import { Trash } from "@styled-icons/boxicons-solid/Trash";
import useDeleteChatPrompt from '../custom-hooks/useDeleteChatPrompt';

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
const EditIcon = tw(Edit)`
    w-6 h-6
    cursor-pointer
    ml-4
`;
const TrashIcon = tw(Trash)`
    w-6 h-6
    cursor-pointer
    ml-4
`

/**
 * Custom hook for choosing which prompt to use.
 * 
 * @param {any} chat Chosen chat. 
 * @returns {any} Prompt props.
 */
function usePrompt(chat: any) {
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

export default function ChatHeader({ chat }) {
    const dispatch = useDispatch();
    const modal = usePrompt(chat);
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
                {
                    chat.admin._id === user._id &&
                        <>
                            <EditIcon onClick={() => dispatch(promptActions.show(prompt.UPDATE_CHAT))} />
                            <TrashIcon onClick={() => dispatch(promptActions.show(prompt.DELETE_CHAT))} />
                        </>
                }
            </div>
            <Prompt modal={modal} />
        </Header>
    );
}