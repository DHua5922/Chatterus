import tw from "tailwind-styled-components";

const Message = tw.div`
    items-center
    flex
    ${props => props.textColor || "text-black"}
    ${props => props.textSize || "text-base"}
`;

export default function IconMessage({ classes={}, icon=null, message="" }) {
    return (
        <Message {...classes}>
            {icon}
            <div className={"ml-2"}>{message}</div>
        </Message>
    );
}