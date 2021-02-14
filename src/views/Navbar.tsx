import tw from "tailwind-styled-components"
import { pageLinks } from "../constants";

const NavItem = tw.li`
    border-2
    text-center
    p-1.5
    hover:bg-white
    hover:text-black
    cursor-pointer
`;

const Nav = tw.ul`
    items-center
    flex
    justify-center
    py-8	
    bg-gray-700	
    text-white
`;

const Brand = ({ imgSrc="", label="" }) => (
    <a href="/" className="text-4xl flex">
        <img src={imgSrc} />
        {label}
    </a>
);

const NavLink = ({ href="", label="" }) => (
    <a href={href}>
        <NavItem>{label}</NavItem>
    </a>
);

const links = [
    {
        href: pageLinks.login,
        label: "Login",
    },
    {
        href: pageLinks.signup,
        label: "Sign Up",
    }
]

export default function Navbar() {
    return (
        <Nav>
            <Brand label={"Chatterus"} />
            <div className="px-12" />
            <div className="grid grid-cols-2 gap-4">
                {links.map(link => <NavLink {...link} />)}
            </div>
        </Nav>
    );
}