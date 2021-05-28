import PasswordService from "../../src/api/services/PasswordService";
import { pageLinks } from "../../src/constants";
import loadActions from "../../src/redux/actions/LoadAction";
import signUpActions from "../../src/redux/actions/SignUpAction";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../src/redux/reducers/allReducer";
import React from "react";
import { Load, Registration } from "../../src/types/redux";
import { FieldLabel, FormField } from "../../src/types/form";
import AuthForm from "../../src/views/AuthForm";
import AuthPage from "../../src/views/AuthPage";

/**
 * Custom hook for creating properties to use for form fields.
 * 
 * @returns {FormField[]} Form field properties.
 */
function useFields(): FormField[] {
    const loadState: Load = useSelector((state: RootState) => state.loadReducer);
    const { email }: Registration = useSelector((state: RootState) => state.signUpReducer);
    const dispatch = useDispatch();

    const label: FieldLabel = {
        props: {},
        children: "",
    };
    return [
        {
            label: label,
            input: {
                type: "email",
                placeholder: "email",
                value: email,
                onChange: (evt) => dispatch(signUpActions.updateEmail(evt.target.value)),
            },
            message: {
                error: (loadState.error && loadState.error.email_error) ? loadState.error.email_error : [],
                success: "",
            },
        },
    ];
}

/**
 * Creates a handler for emailing password reset link
 * when the form has been submitted.
 * 
 * @return {Function} submit event handler.
 */
function useOnSubmit(): Function {
    const dispatch = useDispatch();
    const { email }: Registration = useSelector((state: RootState) => state.signUpReducer);

    return (evt) => {
        evt.preventDefault();
        dispatch(loadActions.pending());
        PasswordService
            .sendResetLink(email, window.location.origin + pageLinks.resetPassword)
            .then((response) => dispatch(loadActions.success(response.data.success)))
            .catch((error) => {
                let errorMsg = "There was a problem sending you the reset link.";
                if(error.response && error.response.status === 400) {
                    errorMsg = error.response.data.error;
                }
                dispatch(loadActions.fail(errorMsg))
            });
    };
}

/**
 * Creates form for sending password reset link.
 * 
 * @returns {JSX.Element} Form element.
 */
function MainContent(): JSX.Element {
    const { success, isPending, error }: Load = useSelector((state: RootState) => state.loadReducer);

    const properties = {
        form: {
            onSubmit: useOnSubmit(), 
        },
        header: "Reset Password",
        fields: useFields(),
        buttons: [
            {
                props: {},
                children: "Send Reset Link",
                onClick: useOnSubmit(),
            }
        ],
        message: {
            success: success ? success : "",
            error: error ? error : "",
            pending: {
                isPending: isPending,
                message: "Sending email...",
            },
        },
        footer: <></>
    };

    return <AuthForm {...properties} />;
}

/**
 * Shows email page.
 * 
 * @returns {JSX.Element} Page element.
 */
 export default function EmailPage(): JSX.Element {
    const Page = AuthPage(MainContent);
    return <Page title="Reset Password" />
}