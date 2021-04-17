import Navbar from "./Navbar";

function GuestPage(Component: any) {
    return function GuestPageComponent() {
        return (
            <>
                <Navbar />
                <Component />
            </>
        )
    }
}

export default GuestPage;