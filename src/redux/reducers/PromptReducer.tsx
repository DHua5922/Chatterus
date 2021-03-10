import { redux } from "../../constants";

const initialState = {
    open: false,
    promptToOpen: "" as string,
};

export default function PromptReducer(state = initialState, action) {
    const { type, payload } = action;
    
    if(type === redux.SHOW_PROMPT) {
        return {
            open: true,
            promptToOpen: payload,
        };
    } else if(type === redux.CLOSE_PROMPT) {
        const { open, ...rest } = state;
        return {
            open: false,
            ...rest
        };
    }

    return state;
}