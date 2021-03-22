import { useState } from "react";
import tw from "tailwind-styled-components";

const RecentMessage = tw.small`
    ${props => props.textColor || "text-gray-500"}
`;

const Chat = tw.div`
    py-4 
    px-16 
    border-b
    hover:bg-gray-50 
    cursor-pointer
    whitespace-nowrap
    overflow-ellipsis
    overflow-hidden
`;

function ChatPreview({ title, latestMsg, styles, onClick }) {
    return (
        <Chat {...styles.container} onClick={onClick}>
            <h1 {...styles.title}>{title}</h1>
            <RecentMessage {...styles.message}>
                {latestMsg}
            </RecentMessage>
        </Chat>
    );
}

export default function ChatList({ chats }) {
    return (
        <>
            { chats.map(chat => <ChatPreview {...chat} />) }
        </>
    );
}