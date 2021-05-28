import { redux } from "../../constants";
import { Load } from "../../types/redux";

export const initialLoadState: Load = {
    isPending: false as boolean,
    success: null as any,
    error: null as any,
};

export default function LoadReducer(state: Load = initialLoadState, action: { type: any; payload: any; }): Load {
    const { type, payload } = action;

    switch(type) {
        case redux.PENDING:   
            return {
                isPending: payload,
                error: null,
                success: null
            };
        case redux.SUCCESS:
            return {
                isPending: false,
                error: null,
                success: payload
            };
        case redux.FAIL:
            return {
                isPending: false,
                error: payload,
                success: null
            };
        default: 
            return state;
    }
}