import { redux } from "../../constants";

const initialState = {
    open: false,
    header: {
        children: "" as any
    },
    body: {
        children: "" as any
    },
    footer: {
        props: {},
        children: "" as any
    },
    message: {
        success: "" as string,
        error: "" as string,
        pending: {
            isPending: false as boolean,
            message: "" as string
        }
    }
};

export default function PromptReducer(state = initialState, action) {
    const { type } = action;
    
    if(type === redux.SHOW_PROMPT) {
        const { open, ...rest } = state;
        return {
            open: true,
            ...rest
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