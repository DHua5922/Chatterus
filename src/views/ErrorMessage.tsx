import IconMessage from "./IconMessage";
import { ErrorCircle } from "@styled-icons/boxicons-regular/ErrorCircle";
import tw from "tailwind-styled-components";

const ErrorIcon = tw(ErrorCircle)`
    w-5
    h-5
`;

export default function ErrorMessage({ message="" }) {
    return (
        <IconMessage
            classes={{ textColor: "text-red-500" }}
            icon={<ErrorIcon />}
            message={message}
        />
    );
}