import { redux } from "../../constants";
import { UserAction } from "../actions/UserAction";

interface User {
    createdAt: string
    email: string
    username: string
    _id: string
}

interface Chat {
    admin: string
    createdAt: string
    messages: Message[]
    title: string
    _id: string
}

interface Message {
    createdAt: string
    message: string
    userId: User
    _id: string
}

interface UserState {
    user: User
    chats: Chat[]
    chosenChatId: string
}

const defaultState: UserState = {
    user: null,
    chats: null,
    chosenChatId: "",
};

function UserReducer(state: UserState = defaultState, action: UserAction): UserState {
    const { type, payload } = action;

    if(type === redux.SET_USER) {
        return {
            ...state,
            user: payload as User
        }
    }
    else if(type === redux.ADD_CHAT) {
        return {
            ...state,
            chats: (state.chats ? [...state.chats, payload as Chat] : [payload as Chat]) as Chat[]
        }
    }
    else if(type === redux.REMOVE_CHAT) {
        return {
            ...state,
            chats: state.chats.filter(({ _id }: Chat) => _id !== payload as string) as Chat[]
        }
    } else if(type === redux.UPDATE_CHAT) {
        return {
            ...state,
            chats: state.chats.map((chat: Chat) => (chat._id !== (payload as Chat)._id) ? chat : payload) as Chat[]
        }
    } else if(type === redux.SET_CHATS) {
        return {
            ...state,
            chats: payload as Chat[]
        }
    }
    else if(type === redux.CHOOSE_CHAT) {
        return {
            ...state,
            chosenChatId: payload as string
        }
    }
    else if(type === redux.SET_ALL) {
        return payload as UserState;
    }
    
    return state;
}

export type {
    User,
    Chat,
    Message,
    UserState,
}
export default UserReducer;