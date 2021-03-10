import React, { useContext, useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/allReducer';
import promptActions from '../redux/actions/PromptAction';
import { SocketContext } from '../context/socket';
import { Socket } from 'socket.io-client';
import loadActions from '../redux/actions/LoadAction';
import { prompt } from '../constants';
import { Chip, MenuItem, Select } from '@material-ui/core';
import UserService from '../api/services/UserService';

const PromptButton = tw.button`
    bg-blue-500
    px-4 py-2
    text-white
    rounded-sm
`;
const MySelect = tw(Select)`
    w-full
`;
const MyChip = tw(Chip)`
    m-1
`;

/**
 * Gets all the other users.
 * 
 * @param {string} userId Id of logged in user.
 * @returns {any[]} All the other users.
 */
function getAllUsers(userId: string) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(users.length === 0) {
            UserService.getAllUsers()
                .then(success => setUsers(success.data.filter(user => userId !== user._id)));
        }
    }, [users]);

    return users;
}

/**
 * Custom hook for responding to inviting users to chat.
 * 
 * @return {any} Functions for responding to inviting users to chat.
 */
function useAddUsersResponses() {
    const dispatch = useDispatch();
    const socket: Socket = useContext(SocketContext);

    function onAddingUsers(
        inviterId: string, 
        invitedUsernameList: string[], 
        chatId: string
    ) {
        dispatch(loadActions.pending());
        socket.emit("INVITE_USERS", {
            inviterId, 
            invitedUsernameList, 
            chatId
        });
    }

    return { onAddingUsers };
}

/**
 * Custom hook for creating prompt for inviting users to chat.
 * 
 * @param {string} chatId Id of chat to invite user to. 
 * @returns {any} Prompt props.
 */
export default function useAddUserPrompt(chatId: string) {
    const dispatch = useDispatch();
    const { open, promptToOpen } = useSelector((state: RootState) => state.promptReducer);
    const { success, error, isPending } = useSelector((state: RootState) => state.loadReducer);
    const [usersToInvite, setUsersToInvite] = useState([] as string[]);
    const { onAddingUsers } = useAddUsersResponses();
    const { user } = useSelector((state: RootState) => state.userReducer);
    const users = getAllUsers(user._id);
    const socket: Socket = useContext(SocketContext);

    socket.on("INVITE_USERS_SUCCESS", (data) => {
        if(data === user._id)
            dispatch(loadActions.success("Invitation sent."));
    });

    socket.on("INVITE_USERS_ERROR", (error) => {
        if(error.inviterId === user._id)
            dispatch(loadActions.fail(error.message));
    });

    const props = {
        open: open && promptToOpen === prompt.ADD_USERS,
        onClose: () => dispatch(promptActions.close())
    };
    const header = {
        children: "Invite Users"
    };
    const body = {
        children:
            <>
                <MySelect 
                    value={usersToInvite} 
                    onChange={evt => setUsersToInvite(evt.target.value as string[])} 
                    multiple
                    renderValue={(selected) => (
                        <div className="flex flex-wrap">
                            {(selected as string[]).map((value) => (
                                <MyChip key={value} label={value} />
                            ))}
                        </div>
                    )}
                >
                    {
                        users.map(user => {
                            const { _id, username } = user;
                            return (
                                <MenuItem key={_id} value={username}>
                                    {username}
                                </MenuItem>
                            );
                        })
                    }
                </MySelect>
            </>
    };
    const footer = {
        props: {},
        children: <div className="flex justify-center">
            <PromptButton 
                onClick={() => onAddingUsers(user._id, usersToInvite, chatId)} 
            >
                Invite users
            </PromptButton>
        </div>
    };
    const message = {
        success: success,
        error: error,
        pending: {
            isPending: isPending,
            message: "Inviting users..."
        }
    };

    return { props, header, body, footer, message };
}