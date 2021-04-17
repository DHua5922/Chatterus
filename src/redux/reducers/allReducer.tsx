import { combineReducers } from "redux";
import LoadReducer from "./LoadReducer";
import LoginReducer from "./LoginReducer";
import PromptReducer from "./PromptReducer";
import SignUpReducer from "./SignUpReducer";
import UserReducer from "./UserReducer";

const allReducer = combineReducers({
    loadReducer: LoadReducer,
    signUpReducer: SignUpReducer,
    userReducer: UserReducer,
    promptReducer: PromptReducer,
    loginReducer: LoginReducer
});

export type RootState = ReturnType<typeof allReducer>;
export default allReducer;