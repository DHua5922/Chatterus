import { redux } from "../../constants";

export const initialUserState = {
    user: null,
    chats: null,
    chosenChat: null,
};

export default function UserReducer(state = initialUserState, action) {
    const { type, payload } = action;

    let updatedState = state;
    if(type === redux.SET_CHATS) {
        const { chats, ...rest } = updatedState;
        updatedState = {
            chats: payload,
            ...rest,
        };
    } else if(type === redux.SET_CHOSEN_CHAT) {
        const { chosenChat, ...rest } = updatedState;
        updatedState = {
            chosenChat: payload,
            ...rest,
        };
    } else if(type === redux.SET_USER) {
        const { user, ...rest } = updatedState;
        updatedState = {
            user: payload,
            ...rest,
        };
    } else if(type === redux.SET_ALL) {
        updatedState = payload;
    }
    
    return updatedState;
}