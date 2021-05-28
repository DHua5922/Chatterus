import React from "react";
import PageTitle from "./PageTitle";

interface Props {
    title: string
}

function Page(Component: any) {
    return function PageComponent({ title }: Props) {
        return (
            <>
                <PageTitle title={title} />
                <Component />
            </>
        );
    }
}

export default Page;