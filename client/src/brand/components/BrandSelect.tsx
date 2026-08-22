import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import Select, {
    components,
    type ClearIndicatorProps,
    type ControlProps,
    type DropdownIndicatorProps,
    type NoticeProps,
    type OptionProps
} from "react-select";
import { Check, ChevronDown, Loader2, SearchX, Tag, X } from "lucide-react";
import type { IBrand } from "../../types/brand";
import { useGetAllBrandsQuery, useLazyGetBrandSuggestionsQuery } from "../api/brandApi";

interface Props {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>;
    value?: IBrand | string | null;
    onChange?: (val: IBrand | null) => void;
}

interface SelectOption {
    value: string;
    label: string;
}

// Custom Control component with left Tag icon
const BrandControl = (props: ControlProps<SelectOption, false>) => {
    return (
        <components.Control {...props}>
            <div className="pl-3 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 pointer-events-none">
                <Tag size={16} />
            </div>
            {props.children}
        </components.Control>
    );
};

// Custom Dropdown Indicator with animated ChevronDown
const CustomDropdownIndicator = (props: DropdownIndicatorProps<SelectOption, false>) => {
    const { selectProps } = props;
    return (
        <components.DropdownIndicator {...props}>
            <ChevronDown
                size={16}
                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                    selectProps.menuIsOpen ? "rotate-180 text-green-600 dark:text-green-400" : ""
                }`}
            />
        </components.DropdownIndicator>
    );
};

// Custom Clear Indicator with X icon
const CustomClearIndicator = (props: ClearIndicatorProps<SelectOption, false>) => {
    return (
        <components.ClearIndicator {...props}>
            <div className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={14} />
            </div>
        </components.ClearIndicator>
    );
};

// Custom Loading Indicator with spinning Loader2
const CustomLoadingIndicator = () => {
    return (
        <div className="px-1.5 flex items-center justify-center text-green-600 dark:text-green-400">
            <Loader2 size={16} className="animate-spin" />
        </div>
    );
};

// Custom Option component with brand initial badge and selected checkmark
const CustomOption = (props: OptionProps<SelectOption, false>) => {
    const { isSelected, isFocused, label } = props;
    return (
        <components.Option {...props}>
            <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-semibold ${
                    isSelected
                        ? "bg-green-600 text-white shadow-sm font-bold"
                        : isFocused
                        ? "bg-green-50/80 dark:bg-slate-800 text-green-800 dark:text-green-300"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                            isSelected
                                ? "bg-white/20 text-white"
                                : "bg-green-100/70 dark:bg-green-950/60 text-green-700 dark:text-green-400"
                        }`}
                    >
                        {label ? label.charAt(0).toUpperCase() : "B"}
                    </div>
                    <span className="truncate">{label}</span>
                </div>
                {isSelected && <Check size={16} className="shrink-0 text-white" />}
            </div>
        </components.Option>
    );
};

// Custom NoOptionsMessage component
const CustomNoOptionsMessage = (props: NoticeProps<SelectOption, false>) => {
    return (
        <components.NoOptionsMessage {...props}>
            <div className="py-4 px-3 text-center flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500">
                <SearchX size={20} />
                <span className="text-xs font-semibold">No brands found</span>
            </div>
        </components.NoOptionsMessage>
    );
};

const BrandSelectContent = ({
    value,
    onChange
}: {
    value?: IBrand | string | null;
    onChange?: (val: IBrand | null) => void;
}) => {
    const { data: allBrandsRes, isLoading: loadingAll } = useGetAllBrandsQuery(undefined);
    const [getBrandSuggestions, { isFetching }] = useLazyGetBrandSuggestionsQuery();
    const [searchResults, setSearchResults] = useState<IBrand[] | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const allBrands: IBrand[] = allBrandsRes?.data || [];

    // Use searched results if user typed something, otherwise display all available brands
    const activeBrands = searchResults !== null ? searchResults : allBrands;

    const handleInputChange = (inputValue: string) => {
        if (!inputValue.trim()) {
            setSearchResults(null);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const res = await getBrandSuggestions(inputValue.trim());
            setSearchResults(res.data?.data || []);
        }, 350);
    };

    const formattedValue = value
        ? {
              value: typeof value === "object" ? value._id : value,
              label: typeof value === "object" ? value.name : value
          }
        : null;

    return (
        <Select<SelectOption, false>
            unstyled
            isLoading={loadingAll || isFetching}
            placeholder="Select or search brand..."
            isClearable
            options={activeBrands.map((b) => ({
                value: b._id || "",
                label: b.name
            }))}
            value={
                formattedValue && formattedValue.value
                    ? { value: formattedValue.value, label: formattedValue.label }
                    : null
            }
            onInputChange={handleInputChange}
            onChange={(selected) => {
                if (!selected) return onChange?.(null);

                const brand =
                    allBrands.find((b) => b._id === selected.value) ||
                    searchResults?.find((b) => b._id === selected.value) ||
                    { _id: selected.value, name: selected.label };

                onChange?.(brand);
            }}
            components={{
                Control: BrandControl,
                DropdownIndicator: CustomDropdownIndicator,
                ClearIndicator: CustomClearIndicator,
                LoadingIndicator: CustomLoadingIndicator,
                Option: CustomOption,
                NoOptionsMessage: CustomNoOptionsMessage
            }}
            classNames={{
                control: ({ isFocused }) =>
                    `flex items-center min-h-[42px] rounded-xl border transition-all cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                        isFocused
                            ? "border-green-600 ring-2 ring-green-100 dark:ring-green-950/50"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`,
                menu: () =>
                    "mt-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100",
                menuList: () => "p-1 space-y-1 max-h-56 overflow-y-auto",
                placeholder: () => "text-slate-400 dark:text-slate-500 text-sm font-medium",
                singleValue: () => "text-slate-900 dark:text-slate-100 text-sm font-semibold truncate",
                input: () => "text-slate-900 dark:text-white text-sm font-semibold",
                valueContainer: () => "px-2 py-1 flex-1 flex items-center gap-1.5 text-sm overflow-hidden",
                indicatorsContainer: () => "flex items-center gap-1 pr-1.5 shrink-0"
            }}
        />
    );
};

const BrandSelect = ({ name, control, value, onChange }: Props) => {
    if (name && control) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <BrandSelectContent
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                    />
                )}
            />
        );
    }

    return <BrandSelectContent value={value} onChange={onChange} />;
};

export default BrandSelect;