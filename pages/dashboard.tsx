import React from "react";
import ChatList from "../src/views/ChatList";
import ChosenChat from "../src/views/ChosenChat";
import { useDispatch, useSelector } from "react-redux";
import { AddCircle } from "@styled-icons/ionicons-sharp/AddCircle";
import tw from "tailwind-styled-components";
import promptActions from "../src/redux/actions/PromptAction";
import Prompt from "../src/views/Prompt";
import Loading from "../src/views/Loading";
import { prompt } from "../src/constants";
import useCreateChatPrompt from "../src/custom-hooks/useCreateChatPrompt";
import useChats from "../src/custom-hooks/useChats";
import Page from "../src/views/Page";
import UserPage from "../src/views/UserPage";
import { Chat, UserState } from "../src/redux/reducers/UserReducer";
import useFilter from "../src/custom-hooks/useFilter";
import { RootState } from "../src/redux/reducers/allReducer";

const AddCircleIcon = tw(AddCircle)`
    h-16
    absolute
    text-blue-500
    cursor-pointer
    bottom-4
    right-4
`;

const ListContainer = tw.div`
    w-72
    border-r
    relative
    hidden
    md:block
`;

function MainContent() {
    useChats();
    const { user, chats, chosenChatId }: UserState = useSelector((state: RootState) => state.userReducer);
    const dispatch = useDispatch();
    const createChatModal = useCreateChatPrompt(user && user._id)
    const { input, elem } = useFilter();

    let componentToRender;
    if(!user || !chats) {
        // Load dashboard
        componentToRender = <div className="m-auto"><Loading /></div>;
    } else {
        componentToRender = (
            <>
                <ListContainer>
                    {elem}
                    <ChatList input={input} />
                    <AddCircleIcon onClick={() => dispatch(promptActions.show(prompt.CREATE_CHAT))} />
                </ListContainer>
                <ChosenChat chatId={chosenChatId} />
                <Prompt modal={createChatModal} />
            </>
        );
    }
    
    return (
        <div className="flex w-full h-full bg-gray-50">
            {componentToRender}
        </div>
    );
}

export default function DashboardPage() {
    const Dashboard = Page(UserPage(MainContent));
    return <Dashboard title="Chatterus" />
}