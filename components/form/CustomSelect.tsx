import React, {useState} from "react";
import {ChevronDownIcon} from "@nextui-org/shared-icons";

type Option = {
    label: string;
    value: string;
};

type CustomSelectProps = {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({options, value, onChange, className, placeholder}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedValue, setSelectedValue] = useState("");

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find((option) => option.value === value);

    const setSelection = (value: string) => {
        {
            onChange(value)
            setSelectedValue(value);
            setIsOpen(false);
            setSearch("");
        }
    };
    return (
        <div>
            {isOpen && <div className="absolute z-10 w-screen h-screen top-0 left-0 bg-transparent" onClick={() => setIsOpen(false)}></div>}
            <div className={`relative w-full min-w-40 ${className}`}>
                {placeholder && <label className="mb-2 block">{placeholder}</label>}
                <div
                    className="border pl-3 py-2 pr-8 rounded cursor-pointer relative"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedValue ? selectedValue : (selectedOption ? selectedOption.label : "Select an option")}
                    <ChevronDownIcon className="absolute right-2 top-3"/>
                </div>
                {isOpen && (
                    <div className="absolute w-full border bg-background rounded mt-1 shadow-lg z-20">
                        {options.length > 10 && <input
                            type="text"
                            className="w-full border-b outline-none rounded"
                            placeholder="Search.."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />}
                        <ul className="max-h-40 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        className="p-2 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer first:rounded-t last:rounded-b"
                                        onClick={() => setSelection(option.value)}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            ) : (
                                <div className="p-2 text-gray-500">No options found</div>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;
