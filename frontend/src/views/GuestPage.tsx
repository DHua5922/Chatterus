import Navbar from "./Navbar";

function GuestPage(Component: any) {
    return function GuestPageComponent() {
        return (
            <div className="h-full bg-gray-50">
                <Navbar />
                <Component />
            </div>
        )
    }
}

export default GuestPage;