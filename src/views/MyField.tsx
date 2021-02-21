import React from "react";
import tw from "tailwind-styled-components";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const defaultLabel = {
    props: {},
    children: {},
}

const defaultInput = {
    type: "", 
    placeholder: "", 
    value: "",
}

const defaultMessage = {
    success: null,
    error: [],
};

const Field = tw.input`
    leading-5
    py-2 px-4
    w-full
    my-2
    outline-none
    ${props => props.backgroundColor || "bg-white"}
`;

export default function MyField({ label=defaultLabel, input=defaultInput, message=defaultMessage }) {
    return (
        <div>
            <div {...label.props}>{label.children}</div>
            
            <Field {...input} />
            
            { message.error.map(message => <ErrorMessage message={message} />) }
            
            { 
                message.success && 
                    <SuccessMessage message={message.success} /> 
            }
        </div>
    );
}