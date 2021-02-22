import { redux } from "../../constants";

export const initialLoginState = {
    usernameOrEmail: "",
    password: "",
};

export default function LoginReducer(state=initialLoginState, action) {
    const { type, payload } = action;

    let updatedState = state;
    if(type === redux.UPDATE_USERNAME_OR_EMAIL) {
        const { usernameOrEmail, ...rest } = updatedState;
        updatedState = {
            ...rest,
            usernameOrEmail: payload,
        };
    } else if(type === redux.UPDATE_PASSWORD) {
        const { password, ...rest } = updatedState;
        updatedState = {
            ...rest,
            password: payload,
        };
    }

    return updatedState;
}