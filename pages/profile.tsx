import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import UserService from "../src/api/services/UserService";
import { pageLinks } from "../src/constants";
import loadActions from "../src/redux/actions/LoadAction";
import signUpActions from "../src/redux/actions/SignUpAction";
import LoadReducer, { initialLoadState } from "../src/redux/reducers/LoadReducer";
import SignUpReducer, { initialSignUpState } from "../src/redux/reducers/SignUpReducer";
import MyForm from "../src/views/MyForm";
import Prompt from "../src/views/Prompt";
import Sidenav from "../src/views/Sidenav";

const label = {
    props: {},
    children: "",
};

export default function ProfilePage() {
    const [loadState, dispatchLoadState] = useReducer(LoadReducer, initialLoadState);
    const [fieldValues, dispatchFieldValues] = useReducer(SignUpReducer, initialSignUpState);  
    const [profile, setProfile] = useState(null);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if(!profile) 
            UserService
                .getProfile()
                .then(success => {
                    const {username, email} = success.data;
                    dispatchFieldValues(signUpActions.updateUsername(username));
                    dispatchFieldValues(signUpActions.updateEmail(email));
                    setProfile(success.data);
                })
                .catch(() => dispatchLoadState(loadActions.fail("Cannot load profile. Please try again.")));
    }, [profile]);

    const profileFormData = {
        header: { props: {}, children: "Your Profile" },
        fields: [
            {
                label: label,
                input: {
                    type: "text",
                    placeholder: "username",
                    value: fieldValues.username,
                    onChange: (evt) => dispatchFieldValues(signUpActions.updateUsername(evt.target.value)),
                    backgroundColor: "bg-gray-50",
                },
                message: {
                    error: (loadState.success && loadState.success.username_error) ? loadState.success.username_error : [],
                    success: (loadState.success && loadState.success.username_success) ? loadState.success.username_success[0] : null,
                },
            },
            {
                label: label,
                input: {
                    type: "email",
                    placeholder: "email",
                    value: fieldValues.email,
                    onChange: (evt) => dispatchFieldValues(signUpActions.updateEmail(evt.target.value)),
                    backgroundColor: "bg-gray-50",
                },
                message: {
                    error: (loadState.success && loadState.success.email_error) ? loadState.success.email_error : [],
                    success: (loadState.success && loadState.success.email_success) ? loadState.success.email_success[0] : null,
                },
            },
        ],
        buttons: [{
            props: {
                onClick: (evt) => {
                    evt.preventDefault();
                    dispatchLoadState(loadActions.pending());
                    UserService
                        .updateProfile(fieldValues)
                        .then(success => dispatchLoadState(loadActions.success(success.data)))
                        .catch(() => dispatchLoadState(loadActions.fail({ profileError: "Cannot update your profile." })))
                },
            },
            children: "Update Profile",
        }],
        message: {
            success: null,
            error: (loadState.error && loadState.error.profileError) ? loadState.error.profileError : "",
            pending: {
                isPending: loadState.isPending,
                message: "Updating profile...",
            },
        }
    };

    const deleteFormData = {
        header: {props: {}, children: "Delete Account"},
        buttons: [{
            props: {
                onClick: (evt) => {
                    evt.preventDefault();
                    setShowDeletePrompt(true);
                },
                background: "bg-red-600",
            },
            children: "Delete Account",
        }],
    };

    const deletePromptData = {
        props: {
            open: showDeletePrompt,
            onClose: () => setShowDeletePrompt(false),
        },
        header: {
            children: "Delete Account?",
            props: {
                onClose: true,
            }
        },
        body: {
            children: "Once you delete your account, you can't recover it. Are you sure about this?"
        },
        footer: {
            props: {},
            children: 
                <div className="flex justify-center mt-4">
                    <button 
                        className="bg-red-600 px-4 py-2 text-white"
                        onClick={() => {
                            dispatchLoadState(loadActions.pending());
                            UserService
                                .deleteUser()
                                .then(success => {
                                    dispatchLoadState(loadActions.success(success.data));
                                    router.push(pageLinks.homepage);
                                })
                                .catch(() => dispatchLoadState(loadActions.fail("Cannot delete your account.")))
                        }}
                    >
                        Delete Account
                    </button>
                </div>
        },
        message: {
            success: loadState.success ? loadState.success.message : "",
            error: loadState.error ? loadState.error: "",
            pending: {
                isPending: loadState.isPending,
                message: "Deleting your account...",
            },
        }
    };

    return (
        <div className="flex w-full h-screen">
            <Sidenav />
            <main className="w-full grid">
                <MyForm {...profileFormData} />
                <MyForm {...deleteFormData} />
                <Prompt modal={deletePromptData} />
            </main>
        </div>
    );
}