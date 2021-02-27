import tw from "tailwind-styled-components";
import { LogOut } from "@styled-icons/boxicons-regular/LogOut";
import { ChatLeftTextFill } from "@styled-icons/bootstrap/ChatLeftTextFill";
import AuthService from "../api/services/AuthService";
import React, { useReducer, useState } from "react";
import Prompt from "./Prompt";
import { useRouter } from "next/router";
import { pageLinks } from "../constants";
import LoadReducer, { initialLoadState } from "../redux/reducers/LoadReducer";
import loadActions from "../redux/actions/LoadAction";

const Container = tw.div`
    p-4
`;

const BottomList = tw.div`
    fixed bottom-4
`;

const LogOutIcon = tw(LogOut)`
    w-7
`;
const ChatIcon = tw(ChatLeftTextFill)`
    w-7
`;

const LogoutButton = tw.button`
    bg-red-600
    text-white
    px-4 py-2
    rounded-md
`;

let topItems = [];
let bottomItems = [];

export default function Sidenav({ topList=topItems, bottomList=bottomItems }) {
    const [showLogoutPrompt, setShowLogoutPrompt] = useState<boolean>(false);
    const [loadState, dispatchLoadState] = useReducer(LoadReducer, initialLoadState)
    const router = useRouter();

    topItems = [
        {
            icon: <ChatIcon />,
            props: {
                onClick: () => {},
                className: "cursor-pointer",
            },
        }
    ];

    bottomItems = [
        {
            icon: <LogOutIcon />,
            props: {
                onClick: () => setShowLogoutPrompt(true),
                className: "cursor-pointer",
            },
        }
    ];

    const modalData = {
        props: {
            open: showLogoutPrompt,
            onClose: () => setShowLogoutPrompt(false),
        },
        header: {
            props: {},
            children: "Logout?",
        },
        body: {
            props: {},
            children: "Are you sure you want to logout?",
        },
        footer: {
            props: {},
            children: 
                <div className="flex justify-center mt-4">
                    <LogoutButton
                        onClick={() => {
                            dispatchLoadState(loadActions.pending());
                            AuthService
                                .logout()
                                .then(() => router.push(pageLinks.login))
                                .catch(() => {
                                    dispatchLoadState(loadActions.fail("Couldn't log you out. Please try again."));
                                })
                        }}
                    >
                        Logout
                    </LogoutButton>
                </div>,
        },
        message: {
            success: loadState.success,
            error: loadState.error,
            pending: {
                isPending: loadState.isPending,
                message: "Signing you out...",
            },
        },
    };

    return (
        <Container>
            <div>
                {
                    topList.map(navItem => {
                        const { icon, props } = navItem;
                        return <div {...props}>{icon}</div>
                    })
                }
            </div>
            <BottomList>
                {
                    bottomList.map(navItem => {
                        const { icon, props } = navItem;
                        return <div {...props}>{icon}</div>
                    })
                }
            </BottomList>
            <Prompt modal={modalData} />
        </Container>
    );
}