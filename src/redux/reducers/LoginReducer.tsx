import { redux } from "../../constants";
import { Login } from "../../types/redux";

interface Action {
    type: string
    payload: string
}

export const initialLoginState: Login = {
    usernameOrEmail: "",
    password: "",
};

export default function LoginReducer(state: Login=initialLoginState, action: Action): Login {
    const { type, payload } = action;

    if(type === redux.UPDATE_USERNAME_OR_EMAIL) {
        return {
            ...state,
            usernameOrEmail: payload,
        };
    } else if(type === redux.UPDATE_PASSWORD) {
        return {
            ...state,
            password: payload,
        };
    }

    return state;
}