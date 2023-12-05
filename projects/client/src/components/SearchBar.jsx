import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

export default function SearchBar({ id, value, onSubmit, placeholder }) {
    const [searchValue, setSearchValue] = useState(value);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(searchValue);
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full" autoComplete="off">
            <input
                value={searchValue}
                id={id}
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={placeholder}
                className="h-10 rounded-md w-full bg-gray-light border-blue-secondary"
            />
            <button
                type="submit"
                className="absolute right-2 top-2 cursor-pointer"
            >
                <BiSearch className="h-6 w-6 text-blue-background" />
            </button>
        </form>
    );
}
