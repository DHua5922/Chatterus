import tw from "tailwind-styled-components";

const Prompt = tw.div`
    text-xl
    m-auto
`;

export default function ChosenChat({ chat }) {
    return (
        <>
            {
                !chat &&
                    <div className="w-full flex">
                        <Prompt>
                            Choose a chat and start a conversation.
                        </Prompt>
                    </div>
            }
        </>
    )
}