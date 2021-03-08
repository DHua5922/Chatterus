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

const FilterInput = tw.input`
    mx-auto
    py-2 px-4
    outline-none
    border
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
    const [input, setInput] = useState("" as string);

    const inputProps = {
        placeholder: "Search conversations",
        value: input,
        onChange: (evt) => setInput(evt.target.value)
    };

    return (
        <>
            <div className="flex border-b py-4">
                <FilterInput {...inputProps} />
            </div>
            
            { 
                chats.map(chat => {
                    chat.styles = {
                        container: {},
                        title: {},
                        message: {},
                    };
                    const chatTitleToCheck = chat.title.trim().toLowerCase();
                    const desiredChatTitle = input.trim().toLowerCase();
                    return (
                        chatTitleToCheck.includes(desiredChatTitle) 
                            ? <ChatPreview {...chat} /> 
                            : <div />
                    );
                }) 
            }
        </>
    );
}