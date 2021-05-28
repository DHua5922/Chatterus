import { redux } from "../../constants";
import { Registration } from "../../types/redux";

export const initialSignUpState: Registration = {
    username: "" as string,
    email: "" as string,
    password: "" as string,
    cpassword: "" as string,
};

export default function SignUpReducer(state: Registration = initialSignUpState, action): Registration {
    const { type, payload } = action;

    if(type === redux.UPDATE_USERNAME) {
        return {
            ...state,
            username: payload,
        };
    } else if(type === redux.UPDATE_EMAIL) {
        return {
            ...state,
            email: payload,
        };
    } else if(type === redux.UPDATE_PASSWORD) {
        return {
            ...state,
            password: payload,
        };
    } else if(type === redux.UPDATE_CPASSWORD) {
        return {
            ...state,
            cpassword: payload,
        };
    }

    return state;
}