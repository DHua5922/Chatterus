import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordService from "../../src/api/services/PasswordService";
import { pageLinks } from "../../src/constants";
import loadActions from "../../src/redux/actions/LoadAction";
import signUpActions from "../../src/redux/actions/SignUpAction";
import { RootState } from "../../src/redux/reducers/allReducer";
import MyForm from "../../src/views/MyForm";
import Navbar from "../../src/views/Navbar";

export default function PasswordResetPage() {
    const dispatch = useDispatch();
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        setToken(window.location.search.substring("?token=".length));
    });

    const { success, isPending, error } = useSelector((state: RootState) => state.loadReducer);
    const { password, cpassword } = useSelector((state: RootState) => state.signUpReducer);

    const router = useRouter();
    const formData = {
        header: {
            props: {},
            children: "Reset Password",
        },
        fields: [
            {
                label: {
                    props: {},
                    children: "",
                },
                input: {
                    type: "password",
                    placeholder: "New password",
                    value: password,
                    onChange: (evt) => dispatch(signUpActions.updatePassword(evt.target.value)),
                    backgroundColor: "bg-gray-50",
                },
            },
            {
                label: {
                    props: {},
                    children: "",
                },
                input: {
                    type: "password",
                    placeholder: "Confirm new password",
                    value: cpassword,
                    onChange: (evt) => dispatch(signUpActions.updateConfirmPassword(evt.target.value)),
                    backgroundColor: "bg-gray-50",
                },
            },
        ],
        buttons: [{
            props: {
                onClick: (evt) => {
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
                }
            },
            children: "Reset Password",
        }],
        message: {
            success: success ? success : "",
            error: error ? error : "",
            pending: {
                isPending: isPending,
                message: "Resetting password...",
            },
        },
    };

    return (
        <>
            <Navbar />
            <div className="flex h-screen bg-gray-50">
                <MyForm {...formData} />
            </div>
        </>
    );
}