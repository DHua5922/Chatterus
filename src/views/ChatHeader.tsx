import React from 'react';
import tw from 'tailwind-styled-components';
import { PersonAdd } from "@styled-icons/evaicons-solid/PersonAdd";
import { useDispatch, useSelector } from 'react-redux';
import Prompt from './Prompt';
import promptActions from '../redux/actions/PromptAction';
import { prompt } from '../constants';
import { Exit } from "@styled-icons/icomoon/Exit";
import { RootState } from '../redux/reducers/allReducer';
import { Edit } from "@styled-icons/entypo/Edit";
import { Trash } from "@styled-icons/boxicons-solid/Trash";
import usePrompt from '../custom-hooks/usePrompt';

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
`;

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