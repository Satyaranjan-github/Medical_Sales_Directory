import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import Select from "react-select";
import type { IBrand } from "../../types/brand";
import { useLazyGetBrandSuggestionsQuery } from "../api/brandApi";

interface Props {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
}

const BrandSelect = ({ name, control }: Props) => {
    const [options, setOptions] = useState<IBrand[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [getBrandSuggestions, { isFetching }] = useLazyGetBrandSuggestionsQuery()

    const fetchBrands = async (search: string) => {
        if (!search) return;

        const res = await getBrandSuggestions(search);
        console.log("Response->", res.data)
        setOptions(res.data.data)
    };

    const handleInputChange = (inputValue: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchBrands(inputValue);
        }, 400);
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    isLoading={isFetching}
                    placeholder="Search brand..."
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

                        const brand = options.find(
                            (b) => b._id === selected.value
                        );

                        field.onChange(brand || null);
                    }}
                />
            )}
        />
    );
};

export default BrandSelect;