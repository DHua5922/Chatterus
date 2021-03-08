import { redux } from "../../constants";

const promptActions = {
    show: () => {
        return {
            type: redux.SHOW_PROMPT
        };
    },
    close: () => {
        return {
            type: redux.CLOSE_PROMPT
        };
    },
};

export default promptActions;