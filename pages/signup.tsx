import React, { useReducer } from "react";
import LoadReducer, { initialLoadState } from "../src/redux/reducers/LoadReducer";
import SignUpReducer, { initialSignUpState } from "../src/redux/reducers/SignUpReducer";
import MyForm from "../src/views/MyForm";
import SignUpActions from "../src/redux/actions/SignUpAction";
import UserService from "../src/api/services/UserService";
import loadActions from "../src/redux/actions/LoadAction";
import { useRouter } from "next/router";
import { pageLinks } from "../src/constants";
import Navbar from '../src/views/Navbar';

export default function SignUpPage() {
    const [loadState, dispatchLoadState] = useReducer(LoadReducer, initialLoadState);
    const [fieldValues, dispatchFieldValues] = useReducer(SignUpReducer, initialSignUpState);

    const label = {
        props: {},
        children: "",
    };
    const properties = {
        form: {
            enableBorder: true,
            onSubmit: (evt) => {
                evt.preventDefault();
                signup(fieldValues);
            }, 
        },
        header: {
            children: "Sign Up",
            props: {},
        },
        fields: [
            {
                label: label,
                input: {
                    type: "text",
                    placeholder: "username",
                    value: fieldValues.username,
                    onChange: (evt) => dispatchFieldValues(SignUpActions.updateUsername(evt.target.value)),
                    backgroundColor: "bg-gray-50",
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
                    onChange: (evt) => dispatchFieldValues(SignUpActions.updateEmail(evt.target.value)),
                    backgroundColor: "bg-gray-50",
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
                    onChange: (evt) => dispatchFieldValues(SignUpActions.updatePassword(evt.target.value)),
                    backgroundColor: "bg-gray-50",
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
                    onChange: (evt) => dispatchFieldValues(SignUpActions.updateConfirmPassword(evt.target.value)),
                    backgroundColor: "bg-gray-50",
                },
                message: {
                    error: [],
                    success: "",
                },
            },
        ],
        buttons: [
            {
                props: {},
                children: "Sign Up",
                onClick: () => signup(fieldValues)
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
    }

    const router = useRouter();
    /**
     * Create a new account for the new user when the form has been submitted.
     * 
     * @param newUser New user information.
     */
    function signup(newUser) {
        dispatchLoadState(loadActions.pending());
        UserService
            .signUp(newUser)
            .then(() => router.push(pageLinks.login))
            .catch(error => {
                if(error.response && error.response.status === 400) {
                    // Invalid new user information
                    dispatchLoadState(loadActions.fail(error.response.data));
                } else {
                    // Server error
                    dispatchLoadState(loadActions.fail({ errorMsg: "There was a problem creating your account." }));
                }
            });
    }
    
    return (
        <>
            <Navbar />
            <div className="flex h-screen bg-gray-50">
                <MyForm
                    form={properties.form}
                    header={properties.header}
                    fields={properties.fields}
                    buttons={properties.buttons}
                    message={properties.message}
                />
            </div>
        </>
    );
}