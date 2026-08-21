import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import Select from "react-select";
import type { ICategory } from "../../types/category";
import { useLazyGetCategorySuggestionsQuery } from "../api/categoryApi";

interface Props {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
}

const CategorySelect = ({ name, control }: Props) => {
    const [options, setOptions] = useState<ICategory[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [getCategorySuggestions, { isFetching }] = useLazyGetCategorySuggestionsQuery()

    const fetchCategories = async (search: string) => {
        if (!search) return;

        const res = await getCategorySuggestions(search);
        console.log("Response->", res.data)
        setOptions(res.data.data)
    };

    const handleInputChange = (inputValue: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchCategories(inputValue);
        }, 400);
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    isLoading={isFetching}
                    placeholder="Search category..."
                    isClearable
                    options={options?.map((b) => ({
                        value: b._id,
                        label: b.name,
                    }))}
                    value={
                        field.value
                            ? { value: field.value._id, label: field.value.name }
                            : null
                    }
                    onInputChange={handleInputChange}
                    onChange={(selected) => {
                        if (!selected) return field.onChange(null);

                        const category = options.find(
                            (b) => b._id === selected.value
                        );

                        field.onChange(category || null);
                    }}
                />
            )}
        />
    );
};

export default CategorySelect;