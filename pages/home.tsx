import React from 'react';
import GuestPage from '../src/views/GuestPage';
import Page from '../src/views/Page';
import tw from "tailwind-styled-components";

const Features = tw.div`
    text-center
    my-12
    block
    sm:flex
    sm:justify-around
    sm:text-left
`;

const Container = tw.div`
    w-60 
    bg-white 
    shadow-md
`;

function Feature({ header, description, imgPath }) {
    return (
        <div className="my-12 px-8">
            <div className="text-2xl text-center">{header}</div>
            <div className="text-lg pt-3">{description}</div>
            <img src={imgPath} className="w-48 pt-4 mx-auto" />
        </div>
    );
}

function MyCard({ img, title }) {
    return (
      <Container>
          <img className="h-40 px-2 pt-2" src={img} />
          <div className="text-center py-1">{title}</div>
      </Container>
    );
}

function MainContent() {

    const cards = [
        {
            img: "/static/friends.jpg",
            title: "Friends"
        },
        {
            img: "/static/family.jpeg",
            title: "Family"
        },
    ];

    const features = [
        {
            header: "Group Messaging",
            description: "Want a private room to chat with your friends and family? Group messaging will do just that.",
            imgPath: "/static/group.png"
        },
        {
            header: "Direct Messaging",
            description: "Want to talk to someone in private or address only that person? You can message a person directly.",
            imgPath: "/static/direct-message.png" 
        }
    ];

    return (
        <>
            <div className="bg-gray-100 py-36 text-center">
                <div className="text-3xl">The best way to chat with everyone you know</div>
            </div>
            <Features>
                { features.map(feature => <Feature {...feature} />) }
            </Features>
            <div className="bg-blue-200 py-16">
                <div className="text-center text-2xl">Stay in touch with those important to you</div>
                <div className="flex justify-center mt-8">
                    {
                        cards.map(card => (
                            <div className="mx-4">
                                <MyCard {...card} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default function Homepage() {
    const Home = Page(GuestPage(MainContent))
    return <Home title="Chatterus" />;
}