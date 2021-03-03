import { combineReducers } from "redux";
import LoadReducer from "./LoadReducer";
import SignUpReducer from "./SignUpReducer";

const allReducer = combineReducers({
    loadReducer: LoadReducer,
    signUpReducer: SignUpReducer,
});

export type RootState = ReturnType<typeof allReducer>;
export default allReducer;