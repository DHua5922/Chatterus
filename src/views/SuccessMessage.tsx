import IconMessage from "./IconMessage";
import { CheckCircle } from "@styled-icons/boxicons-regular/CheckCircle";
import tw from "tailwind-styled-components";

const SuccessIcon = tw(CheckCircle)`
    w-5
    h-5
`;

export default function SuccessMessage({ message="" }) {
    return (
        <IconMessage
            classes={{ textColor: "text-green-500" }}
            icon={<SuccessIcon />}
            message={message}
        />
    );
}