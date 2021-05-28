import { redux } from "../../constants";

const signUpActions = {
    updateUsername: (username: string) => {
        return {
            type: redux.UPDATE_USERNAME,
            payload: username,
        };
    },
    updateEmail: (email: string) => {
        return {
            type: redux.UPDATE_EMAIL,
            payload: email,
        };
    },
    updatePassword: (password: string) => {
        return {
            type: redux.UPDATE_PASSWORD,
            payload: password,
        };
    },
    updateConfirmPassword: (cpassword: string) => {
        return {
            type: redux.UPDATE_CPASSWORD,
            payload: cpassword,
        };
    }
};

export default signUpActions;