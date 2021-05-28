import React from "react";
import { useSelector, useDispatch } from "react-redux";
import SignUpActions from "../src/redux/actions/SignUpAction";
import UserService from "../src/api/services/UserService";
import loadActions from "../src/redux/actions/LoadAction";
import { useRouter } from "next/router";
import { pageLinks } from "../src/constants";
import { Load, Registration } from "../src/types/redux";
import { RootState } from "../src/redux/reducers/allReducer";
import { FieldLabel, FormField } from "../src/types/form";
import AuthPage from "../src/views/AuthPage";
import AuthForm from "../src/views/AuthForm";

/**
 * Custom hook for creating properties to use for form fields.
 * 
 * @returns {FormField[]} Form field properties.
 */
 function useFields(): FormField[] {
    const loadState: Load = useSelector((state: RootState) => state.loadReducer);
    const fieldValues: Registration = useSelector((state: RootState) => state.signUpReducer);
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
                placeholder: "username",
                value: fieldValues.username,
                onChange: (evt) => dispatch(SignUpActions.updateUsername(evt.target.value)),
            },
            message: {
                error: (loadState.error && loadState.error.username_error) ? loadState.error.username_error : [],
                success: "",
            },
        },
        {
            label: label,
            input: {
                type: "email",
                placeholder: "email",
                value: fieldValues.email,
                onChange: (evt) => dispatch(SignUpActions.updateEmail(evt.target.value)),
            },
            message: {
                error: (loadState.error && loadState.error.email_error) ? loadState.error.email_error : [],
                success: "",
            },
        },
        {
            label: label,
            input: {
                type: "password",
                placeholder: "password",
                value: fieldValues.password,
                onChange: (evt) => dispatch(SignUpActions.updatePassword(evt.target.value)),
            },
            message: {
                error: (loadState.error && loadState.error.password_error) ? loadState.error.password_error : [],
                success: "",
            },
        },
        {
            label: label,
            input: {
                type: "password",
                placeholder: "confirm password",
                value: fieldValues.cpassword,
                onChange: (evt) => dispatch(SignUpActions.updateConfirmPassword(evt.target.value)),
            },
            message: {
                error: [],
                success: "",
            },
        },
    ];
}

/**
 * Creates a handler for registering a new user 
 * when the form has been submitted.
 * 
 * @return {Function} submit event handler.
 */
function useOnSubmit(): Function {
    const dispatch = useDispatch();
    const newUser: Registration = useSelector((state: RootState) => state.signUpReducer);
    const router = useRouter();

    return (evt) => {
        evt.preventDefault();
        dispatch(loadActions.pending());
        UserService
            .signUp(newUser)
            .then(() => {
                dispatch(loadActions.success(""));
                router.push(pageLinks.login);
            })
            .catch(error => {
                if(error.response && error.response.status === 400) {
                    // Invalid new user information
                    dispatch(loadActions.fail(error.response.data));
                } else {
                    // Server error
                    dispatch(loadActions.fail({ errorMsg: "There was a problem creating your account." }));
                }
            });
    };
}

/**
 * Creates sign up form element.
 * 
 * @returns {JSX.Element} Sign up form element.
 */
function MainContent(): JSX.Element {
    const loadState: Load = useSelector((state: RootState) => state.loadReducer);
    const properties = {
        form: {
            onSubmit: useOnSubmit(), 
        },
        header: "Sign Up",
        fields: useFields(),
        buttons: [
            {
                props: {},
                children: "Sign Up",
                onClick: useOnSubmit(),
            }
        ],
        message: {
            success: null,
            error: loadState.error ? loadState.error.errorMsg : "",
            pending: {
                isPending: loadState.isPending,
                message: loadState.isPending ? "Creating your account..." : "",
            },
        },
        footer: <></>
    }
    
    return <AuthForm {...properties} />;
}

/**
 * Shows sign up page.
 * 
 * @returns {JSX.Element} Sign up page element.
 */
export default function SignUpPage(): JSX.Element {
    const SignUpPage = AuthPage(MainContent);
    return <SignUpPage title="Sign Up" />
}