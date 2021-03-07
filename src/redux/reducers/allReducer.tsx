import { combineReducers } from "redux";
import LoadReducer from "./LoadReducer";
import SignUpReducer from "./SignUpReducer";
import UserReducer from "./UserReducer";

const allReducer = combineReducers({
    loadReducer: LoadReducer,
    signUpReducer: SignUpReducer,
    userReducer: UserReducer,
});

export type RootState = ReturnType<typeof allReducer>;
export default allReducer;