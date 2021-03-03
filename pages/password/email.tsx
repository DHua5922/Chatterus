import PasswordService from "../../src/api/services/PasswordService";
import { pageLinks } from "../../src/constants";
import loadActions from "../../src/redux/actions/LoadAction";
import signUpActions from "../../src/redux/actions/SignUpAction";
import MyForm from "../../src/views/MyForm";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../src/redux/reducers/allReducer";
import React from "react";
import Navbar from "../../src/views/Navbar";

export default function EmailPage() {
    const dispatch = useDispatch();

    const { success, isPending, error } = useSelector((state: RootState) => state.loadReducer);
    const { email } = useSelector((state: RootState) => state.signUpReducer);

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
                    type: "email",
                    placeholder: "Email",
                    value: email,
                    onChange: (evt) => dispatch(signUpActions.updateEmail(evt.target.value)),
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
                        .sendResetLink(email, window.location.origin + pageLinks.resetPassword)
                        .then((response) => dispatch(loadActions.success(response.data.success)))
                        .catch((error) => {
                            let errorMsg = "There was a problem sending you the reset link.";
                            if(error.response && error.response.status === 400) {
                                errorMsg = error.response.data.error;
                            }
                            dispatch(loadActions.fail(errorMsg))
                        })
                }
            },
            children: "Send Reset Link",
        }],
        message: {
            success: success ? success : "",
            error: error ? error : "",
            pending: {
                isPending: isPending,
                message: "Sending email...",
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