import { redux } from "../../constants"

const loadActions = {
    pending: () => {
        return {
            type: redux.PENDING,
            payload: true,
        };
    },
    success: (success) => {
        return {
            type: redux.SUCCESS,
            payload: success,
        };
    },
    fail: (error) => {
        return {
            type: redux.FAIL,
            payload: error,
        };
    },
};

export default loadActions;