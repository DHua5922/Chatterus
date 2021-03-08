import { combineReducers } from "redux";
import LoadReducer from "./LoadReducer";
import PromptReducer from "./PromptReducer";
import SignUpReducer from "./SignUpReducer";
import UserReducer from "./UserReducer";

const allReducer = combineReducers({
    loadReducer: LoadReducer,
    signUpReducer: SignUpReducer,
    userReducer: UserReducer,
    promptReducer: PromptReducer
});

export type RootState = ReturnType<typeof allReducer>;
export default allReducer;