import { useRouter } from "next/router";
import React, { useReducer } from "react";
import tw from "tailwind-styled-components";
import axios from "axios";
import { pageLinks } from "../src/constants";
import loadActions from "../src/redux/actions/LoadAction";
import loginActions from "../src/redux/actions/LoginAction";
import LoadReducer, { initialLoadState } from "../src/redux/reducers/LoadReducer";
import LoginReducer, { initialLoginState } from "../src/redux/reducers/LoginReducer";
import MyForm from "../src/views/MyForm";

const Link = tw.a`
    underline
    text-blue-500
`;

export default function loginPage() {
    const [loadState, dispatchLoadState] = useReducer(LoadReducer, initialLoadState);
    const [fieldValues, dispatchFieldValues] = useReducer(LoginReducer, initialLoginState);

    const label = {
        props: {},
        children: "",
    };
    const properties = {
        form: {
            enableBorder: true,
            onSubmit: (evt) => {
                evt.preventDefault();
                login(fieldValues);
            }, 
        },
        header: {
            children: "Login",
            props: {},
        },
        fields: [
            {
                label: label,
                input: {
                    type: "text",
                    placeholder: "username or email",
                    value: fieldValues.usernameOrEmail,
                    onChange: (evt) => dispatchFieldValues(loginActions.updateUsernameOrEmail(evt.target.value)),
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
                    type: "password",
                    placeholder: "password",
                    value: fieldValues.password,
                    onChange: (evt) => dispatchFieldValues(loginActions.updatePassword(evt.target.value)),
                    backgroundColor: "bg-gray-50",
                },
                message: {
                    error: (loadState.error && loadState.error.password_error) ? loadState.error.password_error : [],
                    success: "",
                },
            },
        ],
        buttons: [
            {
                props: {},
                children: "Login",
                onClick: () => login(fieldValues)
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
        footer: <Link href={pageLinks.resetEmail}>Forgot password?</Link>,
    }

    const router = useRouter();
    /**
     * Signs the user in.
     * 
     * @param {any} userLogin Login information.
     */
    function login(userLogin) {
        dispatchLoadState(loadActions.pending());
        axios
            .post("auth/login", userLogin)
            .then(() => router.push(pageLinks.dashboard))
            .catch(error => {
                if(error.response && error.response.status === 400) {
                    // Invalid login information
                    dispatchLoadState(loadActions.fail({ errorMsg: error.response.data.message }));
                } else {
                    // Server error
                    dispatchLoadState(loadActions.fail({ errorMsg: "There was a problem signing you in." }));
                }
            });
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <MyForm
                form={properties.form}
                header={properties.header}
                fields={properties.fields}
                buttons={properties.buttons}
                message={properties.message}
                footer={properties.footer}
            />
        </div>
    );
}