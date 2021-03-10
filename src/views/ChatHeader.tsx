import React from 'react';
import tw from 'tailwind-styled-components';
import { PersonAdd } from "@styled-icons/evaicons-solid/PersonAdd";
import { useDispatch } from 'react-redux';
import Prompt from './Prompt';
import promptActions from '../redux/actions/PromptAction';
import { prompt } from '../constants';
import useAddUserPrompt from '../custom-hooks/useAddUserPrompt';

const Header = tw.div`
    bg-white
    w-full
    px-8
    py-3
    flex
    justify-between
`;

const PersonAddIcon = tw(PersonAdd)`
    w-7 h-7
    cursor-pointer
`;

export default function ChatHeader({ chat }) {
    const dispatch = useDispatch();
    const modal = useAddUserPrompt(chat._id);

    return (
        <Header>
            <div>{chat.title}</div>
            <div>
                <PersonAddIcon onClick={() => dispatch(promptActions.show(prompt.ADD_USERS))} />
            </div>
            <Prompt modal={modal} />
        </Header>
    );
}