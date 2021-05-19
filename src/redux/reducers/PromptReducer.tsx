import { redux } from "../../constants";
import { PromptAction } from "../actions/PromptAction";

interface PromptState {
    open: boolean
    promptToOpen: string
}

const initialState: PromptState = {
    open: false,
    promptToOpen: "",
};

function PromptReducer(state: PromptState = initialState, action: PromptAction): PromptState {
    const { type, payload } = action;
    
    if(type === redux.SHOW_PROMPT) {
        return {
            open: true,
            promptToOpen: payload,
        };
    } else if(type === redux.CLOSE_PROMPT) {
        return {
            ...state,
            open: false,
        };
    }

    return state;
}

export type { PromptState };
export default PromptReducer;