import { useState } from "react";
import tw from "tailwind-styled-components";

const FilterInput = tw.input`
    mx-auto
    py-2 px-4
    outline-none
    border
    w-full
`;

/**
 * Custom hook for filter.
 * 
 * @returns {any} Filter element and input.
 */
export default function useFilter() {
    const [input, setInput] = useState("" as string);
    const inputProps = {
        placeholder: "Search conversations",
        value: input,
        onChange: (evt) => setInput(evt.target.value)
    };
    const elem = (
        <div className="flex border-b py-4 px-6">
            <FilterInput {...inputProps} />
        </div>
    );

    return { 
        input,
        elem
    };
}