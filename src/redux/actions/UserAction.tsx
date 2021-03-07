import { redux } from "../../constants";

const userActions = {
    setUser: (user) => {
        return {
            type: redux.SET_USER,
            payload: user,
        };
    },
    setChosenChat: (chosenChat) => {
        return {
            type: redux.SET_CHOSEN_CHAT,
            payload: chosenChat,
        };
    },
    chooseChat: (chatId: string) => {
        return {
            type: redux.CHOOSE_CHAT,
            payload: chatId,
        };
    },
    setChats: (chats) => {
        return {
            type: redux.SET_CHATS,
            payload: chats,
        };
    },
    setAll: (user, chats, chosenChat, chosenChatId: string) => {
        return {
            type: redux.SET_ALL,
            payload: {
                user: user,
                chats: chats,
                chosenChat: chosenChat,
                chosenChatId: chosenChatId,
            },
        };
    },
};

export default userActions;