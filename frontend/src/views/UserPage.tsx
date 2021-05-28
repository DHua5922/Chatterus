import React from "react";
import Sidenav from "./Sidenav";

function UserPage(Component: any) {
    return function UserPageComponent() {
        return (
            <div className="flex w-full h-screen">
                <Sidenav />
                <Component />
            </div>
        )
    }
}

export default UserPage;