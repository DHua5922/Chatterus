import Title from '../src/views/Title';
import React from 'react';
import Navbar from '../src/views/Navbar';

const Caption = ({ header="", description="", classes={container: "", header: "", description: ""} }) => (
    <div className={classes.container}>
        <div className={classes.header}>
            {header}
        </div>

        <div className={classes.description}>
            {description}
        </div>
    </div>
);

const sections = [
    {
        classes: "bg-gray-100 py-32",
        caption: {
            header: "Chat with everyone you know.",
            description: "It is easy to stay in touch.",
            classes: {
                container: "w-max m-auto text-lg",
                header: "sm:text-2xl md:text-3xl pb-20",
                description: "sm:text-xl md:text-2xl text-center",
            },
        }
    },
    {
        classes: "py-36",
        caption: {
            header: "Group Message",
            description: "It is like your own private chat room. Chat with your friends without other strangers knowing about it.",
            classes: {
                container: "w-2/6 m-auto text-lg",
                header: "sm:text-2xl md:text-3xl text-center",
                description: "sm:text-xl md:text-2xl pt-12",
            },
        }
    },
];

export default function Homepage() {
    return (
        <div className="min-w-min">
            <Title title="Home" />
            <Navbar />
            {
                sections.map(section => {
                    const {classes, caption} = section;
                    return (
                        <div className={classes}>
                            <Caption {...caption} />
                        </div>
                    );
                })
            }
        </div>
    );
}