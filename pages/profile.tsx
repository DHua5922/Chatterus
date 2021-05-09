import { useRouter } from "next/router";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../src/api/services/UserService";
import { pageLinks, prompt } from "../src/constants";
import loadActions from "../src/redux/actions/LoadAction";
import promptActions from "../src/redux/actions/PromptAction";
import signUpActions from "../src/redux/actions/SignUpAction";
import { RootState } from "../src/redux/reducers/allReducer";
import { Load, Registration } from "../src/types/redux";
import AuthForm from "../src/views/AuthForm";
import Page from "../src/views/Page";
import Prompt from "../src/views/Prompt";
import UserPage from "../src/views/UserPage";

/**
 * Creates handler for updating profile when form is submitted.
 * 
 * @returns {Function} Submit event handler.
 */
function useOnSubmitProfile(): Function {
    const dispatch = useDispatch();
    const fieldValues: Registration = useSelector((state: RootState) => state.signUpReducer);
    return (evt) => {
        evt.preventDefault();
        dispatch(loadActions.pending());
        UserService
            .updateProfile(fieldValues)
            .then(success => dispatch(loadActions.success(success.data)))
            .catch(() => dispatch(loadActions.fail({ profileError: "Cannot update your profile." })));
    };
}

/**
 * Creates properties for form that updates profile.
 * 
 * @returns {any} Form properties.
 */
function useProfileFormProperties() {
    const loadState: Load = useSelector((state: RootState) => state.loadReducer);
    const dispatch = useDispatch();
    const { username, email }: Registration = useSelector((state: RootState) => state.signUpReducer);

    const label = {
        props: {},
        children: "",
    };
    return {
        form: {
            onSubmit: useOnSubmitProfile(),
            shadow: "shadow-none"
        },
        header: "Your Profile",
        fields: [
            {
                label: label,
                input: {
                    type: "text",
                    placeholder: "username",
                    value: username,
                    onChange: (evt) => dispatch(signUpActions.updateUsername(evt.target.value)),
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
                    value: email,
                    onChange: (evt) => dispatch(signUpActions.updateEmail(evt.target.value)),
                },
                message: {
                    error: (loadState.success && loadState.success.email_error) ? loadState.success.email_error : [],
                    success: (loadState.success && loadState.success.email_success) ? loadState.success.email_success[0] : null,
                },
            },
        ],
        buttons: [
            {
                props: {},
                children: "Update Profile",
                onClick: useOnSubmitProfile(),
            }
        ],
        message: {
            success: null,
            error: (loadState.error && loadState.error.profileError) ? loadState.error.profileError : "",
            pending: {
                isPending: loadState.isPending,
                message: "Updating profile...",
            },
        },
        footer: <></>
    };
}

/**
 * Creates handler for deleting profile when button is clicked.
 * 
 * @returns {MouseEventHandler<HTMLButtonElement>} Click event handler.
 */
function useOnDeleteProfile(): MouseEventHandler<HTMLButtonElement> {
    const dispatch = useDispatch();
    const router = useRouter();
    return () => {
        dispatch(loadActions.pending());
        UserService
            .deleteUser()
            .then(success => {
                dispatch(loadActions.success(success.data));
                router.push(pageLinks.homepage);
            })
            .catch(() => dispatch(loadActions.fail("Cannot delete your account.")))
    };
}

/**
 * Creates properties for prompt.
 * 
 * @returns {any} Prompt properties.
 */
function useDeletePromptProperties(): any {
    const dispatch = useDispatch();
    const loadState = useSelector((state: RootState) => state.loadReducer);
    const { open, promptToOpen } = useSelector((state: RootState) => state.promptReducer);

    return {
        props: {
            open: (open && promptToOpen === prompt.DELETE_ACCOUNT) ? true : false,
            onClose: () => dispatch(promptActions.close()),
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
                        onClick={useOnDeleteProfile()}
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
}

/**
 * Creates section for deleting account.
 * 
 * @returns {JSX.Element} Section element.
 */
function DeleteAccountSection(): JSX.Element {
    const dispatch = useDispatch();
    return (
        <div>
            <div className="text-4xl">Delete Account</div>
            <div className="mt-2 border-b border-gray-300" />
            <p className="my-3">Once you delete your account, it cannot be recovered. Please be sure about this.</p>
            <button 
                className="bg-red-500 text-white py-2 px-5" 
                onClick={() => dispatch(promptActions.show(prompt.DELETE_ACCOUNT))}
            >
                Delete Account
            </button>
        </div>
    );
}

/**
 * Creates main content for profile page.
 * 
 * @returns {JSX.Element} Main content element.
 */
function MainContent() {
    const [profile, setProfile] = useState(null);
    const dispatch = useDispatch();
    const profileFormProperties = useProfileFormProperties();

    useEffect(() => {
        if(!profile) 
            UserService
                .getProfile()
                .then(success => {
                    const { username, email } = success.data;
                    dispatch(signUpActions.updateUsername(username));
                    dispatch(signUpActions.updateEmail(email));
                    dispatch(loadActions.success([]));
                    setProfile(success.data);
                })
                .catch(() => dispatch(loadActions.fail("Cannot load profile. Please try again.")));
    }, [profile]);

    return (
        <main className="mx-auto max-w-sm py-32">
            { profile && <AuthForm {...profileFormProperties} /> }
            <div className="py-8" />
            <DeleteAccountSection />
            <Prompt modal={useDeletePromptProperties()} />
        </main>
    );
}

/**
 * Shows profile page.
 * 
 * @returns {JSX.Element} Page element.
 */
export default function ProfilePage(): JSX.Element {
    const Profile = Page(UserPage(MainContent));
    return <Profile title="Profile" />
}