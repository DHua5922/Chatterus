import { useRouter } from "next/router";
import React from "react";
import tw from "tailwind-styled-components";
import axios from "axios";
import { pageLinks } from "../src/constants";
import loadActions from "../src/redux/actions/LoadAction";
import loginActions from "../src/redux/actions/LoginAction";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../src/views/AuthForm";
import { RootState } from "../src/redux/reducers/allReducer";
import AuthPage from "../src/views/AuthPage";
import { FieldLabel, FormField } from "../src/types/form";
import { Load, Login } from "../src/types/redux";

const Link = tw.a`
    text-blue-500
    hover:underline
    focus:underline
`;

/**
 * Custom hook for creating properties to use for form fields.
 * 
 * @returns {FormField[]} Form field properties.
 */
function useFields(): FormField[] {
    const loadState: Load = useSelector((state: RootState) => state.loadReducer);
    const fieldValues: Login = useSelector((state: RootState) => state.loginReducer);
    const dispatch = useDispatch();

    const label: FieldLabel = {
        props: {},
        children: "",
    };
    return [
        {
            label: label,
            input: {
                type: "text",
                placeholder: "username or email",
                value: fieldValues.usernameOrEmail,
                onChange: (evt) => dispatch(loginActions.updateUsernameOrEmail(evt.target.value)),
            },
            message: {
                error: (loadState.error && loadState.error.username_error) ? loadState.error.username_error : [],
                success: "",
            },
        },
        {
            label: label,
            input: {
                type: "password",
                placeholder: "password",
                value: fieldValues.password,
                onChange: (evt) => dispatch(loginActions.updatePassword(evt.target.value)),
            },
            message: {
                error: (loadState.error && loadState.error.password_error) ? loadState.error.password_error : [],
                success: "",
            },
        },
    ];
}

/**
 * Creates a handler for signing the user in when the
 * form has been submitted.
 * 
 * @return {Function} submit event handler.
 */
function useOnSubmit(): Function {
    const router = useRouter();
    const dispatch = useDispatch();
    const fieldValues: Login = useSelector((state: RootState) => state.loginReducer);

    return (evt) => {
        evt.preventDefault();
        dispatch(loadActions.pending());
        axios
            .post("auth/login", fieldValues)
            .then(() => {
                dispatch(loadActions.success(""));
                router.push(pageLinks.dashboard);
            })
            .catch(error => {
                if(error.response && error.response.status === 400) {
                    // Invalid login information
                    dispatch(loadActions.fail({ errorMsg: error.response.data.message }));
                } else {
                    // Server error
                    dispatch(loadActions.fail({ errorMsg: "There was a problem signing you in." }));
                }
            });
    };
}

/**
 * Creates login form element.
 * 
 * @returns {JSX.Element} Login form element.
 */
function MainContent(): JSX.Element {
    const loadState: Load = useSelector((state: RootState) => state.loadReducer);

    const properties = {
        form: {
            onSubmit: useOnSubmit(), 
        },
        header: "Login",
        fields: useFields(),
        buttons: [
            {
                props: {},
                children: "Login",
                onClick: useOnSubmit()
            }
        ],
        message: {
            success: null,
            error: loadState.error ? loadState.error.errorMsg : "",
            pending: {
                isPending: loadState.isPending,
                message: loadState.isPending ? "Signing you in..." : "",
            },
        },
        footer: 
            <div className="text-center">
                <div className="py-1" />
                <Link href={pageLinks.resetEmail}>Forgot password?</Link>
            </div>,
    }

    return <AuthForm {...properties} />;
}

/**
 * Shows login page.
 * 
 * @returns {JSX.Element} Login page element.
 */
export default function loginPage(): JSX.Element {
    const LoginPage = AuthPage(MainContent);
    return <LoginPage title="Login" />
}