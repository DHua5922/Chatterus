import { redux } from "../../constants";
import { Chat, User, UserState } from "../reducers/UserReducer";

interface UserAction {
    type: string
    payload: string | UserState | Chat[]
}

const userActions = {
    chooseChat: (chatId: string): UserAction => {
        return {
            type: redux.CHOOSE_CHAT,
            payload: chatId,
        };
    },
    setChatList: (chats: Chat[]): UserAction => {
        return {
            type: redux.SET_CHATS,
            payload: chats
        }
    },
    setAll: (user: User, chats: Chat[], chosenChatId: string): UserAction => {
        return {
            type: redux.SET_ALL,
            payload: {
                user,
                chats,
                chosenChatId,
            },
        };
    },
};

export type { UserAction };
export default userActions;