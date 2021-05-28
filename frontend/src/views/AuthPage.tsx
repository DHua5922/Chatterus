import GuestPage from "./GuestPage";
import Page from "./Page";

export default function AuthPage(AuthFormComponent: any) {
    return function AuthPageComponent({ title }) {
        const AuthComponent = () => (
            <div className="bg-gray-50 max-w-sm mx-auto pt-36">
                <AuthFormComponent />
            </div>
        );
        const PageComponent = Page(GuestPage(AuthComponent))
        return <PageComponent title={title} />;
    }
}