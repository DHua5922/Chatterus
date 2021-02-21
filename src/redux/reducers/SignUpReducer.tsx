import { redux } from "../../constants";

export const initialSignUpState = {
    username: "" as string,
    email: "" as string,
    password: "" as string,
    cpassword: "" as string,
};

export default function SignUpReducer(state = initialSignUpState, action) {
    const { type, payload } = action;

    let updatedState = state;
    if(type === redux.UPDATE_USERNAME) {
        const { username, ...rest } = updatedState;
        updatedState = {
            username: payload,
            ...rest,
        };
    } else if(type === redux.UPDATE_EMAIL) {
        const { email, ...rest } = updatedState;
        updatedState = {
            email: payload,
            ...rest,
        };
    } else if(type === redux.UPDATE_PASSWORD) {
        const { password, ...rest } = updatedState;
        updatedState = {
            password: payload,
            ...rest,
        };
    } else if(type === redux.UPDATE_CPASSWORD) {
        const { cpassword, ...rest } = updatedState;
        updatedState = {
            cpassword: payload,
            ...rest,
        };
    }

    return updatedState;
}