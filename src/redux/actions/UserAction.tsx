import { redux } from "../../constants";
import { Chat, User, UserState } from "../reducers/UserReducer";

interface UserAction {
    type: string
    payload: string | UserState | Chat[] | User | Chat
}

const userActions = {
    setUser: (user: User): UserAction => {
        return {
            type: redux.SET_USER,
            payload: user as User
        }
    },
    chooseChat: (chatId: string): UserAction => {
        return {
            type: redux.CHOOSE_CHAT,
            payload: chatId as string,
        };
    },
    addChat: (chat: Chat) => {
        return {
            type: redux.ADD_CHAT,
            payload: chat as Chat
        }
    },
    removeChat: (chatId: string) => {
        return {
            type: redux.REMOVE_CHAT,
            payload: chatId
        }
    },
    updateChat: (chat: Chat) => {
        return {
            type: redux.UPDATE_CHAT,
            payload: chat
        }
    },
    setChats: (chat: Chat[]) => {
        return {
            type: redux.SET_CHATS,
            payload: chat as Chat[]
        }
    },
    setAll: (user: User, chosenChatId: string): UserAction => {
        return {
            type: redux.SET_ALL,
            payload: {
                user,
                chosenChatId,
            } as UserState,
        };
    },
};

export type { UserAction };
export default userActions;