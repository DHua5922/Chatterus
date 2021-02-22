import { redux } from "../../constants";

const loginActions = {
    updateUsernameOrEmail: (usernameOrEmail: string) => {
        return {
            type: redux.UPDATE_USERNAME_OR_EMAIL,
            payload: usernameOrEmail,
        };
    },
    updatePassword: (password: string) => {
        return {
            type: redux.UPDATE_PASSWORD,
            payload: password,
        };
    },
};

export default loginActions;