import { redux } from "../../constants";

interface PromptAction {
    type: string
    payload?: string
}

const promptActions = {
    show: (prompt: string): PromptAction => {
        return {
            type: redux.SHOW_PROMPT,
            payload: prompt
        };
    },
    close: (): PromptAction => {
        return {
            type: redux.CLOSE_PROMPT
        };
    },
};

export type { PromptAction };
export default promptActions;