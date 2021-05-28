import React from "react";
import IconMessage from "./IconMessage";

export default function Loading({ icon=null, message="Loading..." }) {
    return (
        <IconMessage 
            classes={{
                textSize: "text-4xl"
            }}
            icon={icon} 
            message={message} 
        />
    );
}