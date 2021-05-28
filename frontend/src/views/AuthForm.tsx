import React from "react";
import tw from "tailwind-styled-components";
import { FormType, FormButton, FormField, FormHeader, FormMessage } from "../types/form";
import ErrorMessage from "./ErrorMessage";
import IconMessage from "./IconMessage";
import MyField from "./MyField";
import SuccessMessage from "./SuccessMessage";

const Form = tw.form`
    m-auto
    p-8
    ${props => props.shadow || "shadow-lg"}
    bg-white
`;

const Header = tw.div`
    text-center
    text-4xl
    mb-3
`;

const Button = tw.button`
    ${props => props.background || "bg-blue-400"}
    w-full
    py-2
    text-white
    mt-2
    focus:outline-none
`;

function renderMessage(messageElem) {
    return (
        <>
            <div className="mt-2" />
            {messageElem}
        </>
    );
}

interface Props {
    form: FormType
    header: string
    fields: FormField[]
    buttons: FormButton[]
    message: FormMessage
    footer: JSX.Element
}

export default function AuthForm({ form, header, fields, buttons, message, footer }: Props) {
    return (
        <Form {...form}>
            <Header>
                {header}
            </Header>

            { 
                fields.map(field => {
                    const formattedField = {
                        ...field,
                        input: {
                            ...field.input,
                            backgroundColor: "bg-gray-50"
                        }
                    };
                    return (
                        <>
                            <MyField {...formattedField} />
                            <div className="mb-2" />
                        </>
                    );
                }) 
            }

            {
                buttons.map(button => {
                    const { props, children } = button;
                    return <Button {...props}>{children}</Button>;
                })
            }

            { footer }

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