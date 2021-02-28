import React, { useEffect, useReducer, useState } from "react";
import UserService from "../src/api/services/UserService";
import loadActions from "../src/redux/actions/LoadAction";
import signUpActions from "../src/redux/actions/SignUpAction";
import LoadReducer, { initialLoadState } from "../src/redux/reducers/LoadReducer";
import SignUpReducer, { initialSignUpState } from "../src/redux/reducers/SignUpReducer";
import MyForm from "../src/views/MyForm";
import Sidenav from "../src/views/Sidenav";

const label = {
    props: {},
    children: "",
};

export default function ProfilePage() {
    const [loadState, dispatchLoadState] = useReducer(LoadReducer, initialLoadState);
    const [fieldValues, dispatchFieldValues] = useReducer(SignUpReducer, initialSignUpState);  
    const [profile, setProfile] = useState(null);

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
    });

    const formData = {
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
                    success: (loadState.success && loadState.success.username_success.length > 0) ? loadState.success.username_success : null,
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
                    success: (loadState.success && loadState.success.email_success.length > 0) ? loadState.success.email_success : null,
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
                        .catch(() => dispatchLoadState(loadActions.fail("Cannot update your profile.")))
                },
            },
            children: "Update Profile",
        }],
        message: {
            success: null,
            error: loadState.error,
            pending: {
                isPending: loadState.isPending,
                message: "Updating profile...",
            },
        }
    };

    return (
        <div className="flex w-full h-screen">
            <Sidenav />
            <main className="w-full flex">
                <MyForm {...formData} />
            </main>
        </div>
    );
}