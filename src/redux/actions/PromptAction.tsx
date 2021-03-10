import { redux } from "../../constants";

const promptActions = {
    show: (prompt: string) => {
        return {
            type: redux.SHOW_PROMPT,
            payload: prompt
        };
    },
    close: () => {
        return {
            type: redux.CLOSE_PROMPT,
        };
    },
};

export default promptActions;