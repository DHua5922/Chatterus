import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordService from "../../src/api/services/PasswordService";
import { pageLinks } from "../../src/constants";
import loadActions from "../../src/redux/actions/LoadAction";
import signUpActions from "../../src/redux/actions/SignUpAction";
import { RootState } from "../../src/redux/reducers/allReducer";
import { FieldLabel, FormField } from "../../src/types/form";
import { Registration } from "../../src/types/redux";
import AuthForm from "../../src/views/AuthForm";
import AuthPage from "../../src/views/AuthPage";

/**
 * Custom hook for creating properties to use for form fields.
 * 
 * @returns {FormField[]} Form field properties.
 */
 function useFields(): FormField[] {
    const { password, cpassword }: Registration = useSelector((state: RootState) => state.signUpReducer);
    const dispatch = useDispatch();

    const label: FieldLabel = {
        props: {},
        children: "",
    };
    return [
        {
            label,
            input: {
                type: "password",
                placeholder: "New password",
                value: password,
                onChange: (evt) => dispatch(signUpActions.updatePassword(evt.target.value)),
            },
            message: {
                error: [],
                success: "",
            },
        },
        {
            label,
            input: {
                type: "password",
                placeholder: "Confirm new password",
                value: cpassword,
                onChange: (evt) => dispatch(signUpActions.updateConfirmPassword(evt.target.value)),
            },
            message: {
                error: [],
                success: "",
            },
        },
    ];
}

/**
 * Creates a handler for resetting the user's password
 * when the form has been submitted.
 * 
 * @return {Function} submit event handler.
 */
 function useOnSubmit(): Function {
    const dispatch = useDispatch();
    const { password, cpassword }: Registration = useSelector((state: RootState) => state.signUpReducer);
    const [token, setToken] = useState("" as string);
    const router = useRouter();

    useEffect(() => {
        setToken(window.location.search.substring("?token=".length));
    });

    return (evt) => {
        evt.preventDefault();
        dispatch(loadActions.pending());
        PasswordService
            .resetPassword(password, cpassword, token)
            .then((response) => {
                dispatch(loadActions.success(response.data.message));
                router.push(pageLinks.login);
            })
            .catch((error) => {
                let errorMsg = "There was a problem resetting your password.";
                if(error.response && (error.response.status === 400 || error.response.status === 401)) {
                    errorMsg = error.response.data.message;
                }
                dispatch(loadActions.fail(errorMsg))
            })
    };
}

/**
 * Creates form for sending password reset link.
 * 
 * @returns {JSX.Element} Form element.
 */
function MainContent(): JSX.Element {
    const { success, isPending, error } = useSelector((state: RootState) => state.loadReducer);

    const properties = {
        form: {
            onSubmit: useOnSubmit(), 
        },
        header: "Reset Password",
        fields: useFields(),
        buttons: [
            {
                props: {},
                children: "Reset Password",
                onClick: useOnSubmit(),
            }
        ],
        message: {
            success: success ? success : "",
            error: error ? error : "",
            pending: {
                isPending: isPending,
                message: "Resetting password...",
            },
        },
        footer: <></>
    };

    return <AuthForm {...properties} />;
}

/**
 * Shows password reset page.
 * 
 * @returns {JSX.Element} Page element.
 */
export default function PasswordResetPage() {
    const ResetPage = AuthPage(MainContent);
    return <ResetPage title="Reset Password" />;
}