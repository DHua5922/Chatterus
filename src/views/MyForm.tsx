import React from "react";
import tw from "tailwind-styled-components";
import ErrorMessage from "./ErrorMessage";
import IconMessage from "./IconMessage";
import MyField from "./MyField";
import SuccessMessage from "./SuccessMessage";

const defaultForm = {};
const defaultHeader = {
    props: {},
    children: "",
};
const defaultFields = [];
const defaultButtons = [];
const defaultMessage = {
    success: null,
    error: null,
    pending: {
        isPending: false,
        message: "",
    },
};

const Header = tw.div`
    text-center
    text-4xl
    mb-3
`;

const Form = tw.form`
    ${props => props.enableBorder ? "border border-gray-200" : ""}
    m-auto
    p-8
    ${props => props.backgroundColor || "bg-white"}
`;

const Button = tw.button`
    ${props => props.background || "bg-blue-400"}
    w-full
    py-2
    text-white
    mt-2
`;

function renderMessage(messageElem) {
    return (
        <>
            <div className="mt-2" />
            {messageElem}
        </>
    );
}

export default function MyForm({ 
    form=defaultForm, 
    header=defaultHeader, 
    fields=defaultFields, 
    buttons=defaultButtons, 
    message=defaultMessage 
}) {
    return (
        <Form {...form}>
            <Header {...header.props}>
                {header.children}
            </Header>

            { 
                fields.map(field => (
                    <>
                        <MyField {...field} />
                        <div className="mb-2" />
                    </>
                )) 
            }

            {
                buttons.map(button => {
                    const { props, children } = button;
                    return <Button {...props}>{children}</Button>;
                })
            }

            { 
                message.pending.isPending && 
                    renderMessage(<IconMessage message={message.pending.message} />)
            }

            { 
                message.error && 
                    renderMessage(<ErrorMessage message={message.error} />)
            }

            { 
                message.success && 
                    renderMessage(<SuccessMessage message={message.success} />)
            }
        </Form>
    );
}