interface FormType {
    onSubmit: Function
}

interface FormHeader {
    header: string
}

interface FormField {
    label: FieldLabel
    input: FieldInput
    message: FieldMessage
}

interface FieldLabel {
    props: any
    children: string
}

interface FieldInput {
    type: string
    placeholder: string
    value: string
    onChange: Function
}

interface FieldMessage {
    error: string[]
    success: string
}

interface FormButton {
    props: any
    children: string
    onClick: Function
}

interface FormMessage {
    success: any
    error: any
    pending: Pending
}

interface Pending {
    isPending: boolean
    message: string
}

export type {
    FormType,
    FormHeader,
    FormField,
    FieldLabel,
    FieldInput,
    FieldMessage,
    FormButton,
    FormMessage,
    Pending
}