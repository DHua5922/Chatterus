import React from "react";
import userActions from "../src/redux/actions/UserAction";
import ChatList from "../src/views/ChatList";
import ChosenChat from "../src/views/ChosenChat";
import { useDispatch } from "react-redux";
import { AddCircle } from "@styled-icons/ionicons-sharp/AddCircle";
import tw from "tailwind-styled-components";
import promptActions from "../src/redux/actions/PromptAction";
import Prompt from "../src/views/Prompt";
import Loading from "../src/views/Loading";
import { getLatestMessage, prompt } from "../src/constants";
import useFilter from "../src/custom-hooks/useFilter";
import useCreateChatPrompt from "../src/custom-hooks/useCreateChatPrompt";
import useChats from "../src/custom-hooks/useChats";
import Page from "../src/views/Page";
import UserPage from "../src/views/UserPage";

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
    const dispatch = useDispatch();
    const { chosenChatId, chats, user, chosenChat } = useChats();
    const modal = useCreateChatPrompt(
        user ? user._id : "", 
        chats ? chats: []
    );
    const { input, elem } = useFilter();

    let componentToRender;
    if(!chats) {
        // Load dashboard
        componentToRender = <div className="m-auto"><Loading /></div>;
    } else {
        // Display dashbaord
        let chatPreviewList = chats.map(chat => {
            return {
                ...chat,
                latestMsg: getLatestMessage(chat.messages, user._id),
                onClick: () => dispatch(userActions.chooseChat(chat._id))
            };
        });
        chatPreviewList = chatPreviewList.filter(chat => {
            const chatTitleToCheck = chat.title.trim().toLowerCase();
            const desiredChatTitle = input.trim().toLowerCase();
            return chatTitleToCheck.includes(desiredChatTitle);
        });
        componentToRender = (
            <>
                <ListContainer>
                    {elem}
                    <ChatList chats={chatPreviewList} />
                    <AddCircleIcon onClick={() => dispatch(promptActions.show(prompt.CREATE_CHAT))} />
                </ListContainer>
                <ChosenChat chatId={chosenChatId} />
                <Prompt 
                    modal={modal} 
                />
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