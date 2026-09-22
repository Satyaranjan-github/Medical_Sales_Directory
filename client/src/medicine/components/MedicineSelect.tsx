import { Check, ChevronDown, Loader2, Pill, SearchX, X } from "lucide-react";
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
import type { IMedicine } from "../../types/medicine";
import { useGetAllMedicinesQuery, useLazyGetMedicineSuggestionsQuery } from "../api/medicineApi";

interface Props {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>;
    value?: IMedicine | string | null;
    onChange?: (medicineId: string, medicine?: IMedicine) => void;
    medicines?: IMedicine[];
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    error?: string;
    label?: string;
    required?: boolean;
}

interface SelectOption {
    value: string;
    label: string;
    medicine?: IMedicine;
}

// Custom Control component with left Pill icon
const MedicineControl = (props: ControlProps<SelectOption, false>) => {
    return (
        <components.Control {...props}>
            <div className="pl-3 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 pointer-events-none">
                <Pill size={16} />
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
                    selectProps.menuIsOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
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
        <div className="px-1.5 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Loader2 size={16} className="animate-spin" />
        </div>
    );
};

// Custom Option component with medicine initial badge and selected checkmark
const CustomOption = (props: OptionProps<SelectOption, false>) => {
    const { isSelected, isFocused, data } = props;
    const med = data.medicine;

    return (
        <components.Option {...props}>
            <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer text-xs font-semibold ${
                    isSelected
                        ? "bg-emerald-600 text-white shadow-sm font-bold"
                        : isFocused
                        ? "bg-emerald-50/80 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected
                                ? "bg-white/20 text-white"
                                : "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                        }`}
                    >
                        <Pill size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="truncate font-bold text-xs">{data.label}</span>
                        {med && (
                            <span className={`text-[10px] font-medium ${isSelected ? "text-emerald-100" : "text-slate-400 dark:text-slate-400"}`}>
                                ₹{med.sellingPrice} • Stock: {med.stock ?? 0}
                            </span>
                        )}
                    </div>
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
                <span className="text-xs font-semibold">No medicines found</span>
            </div>
        </components.NoOptionsMessage>
    );
};

const MedicineSelectContent = ({
    value,
    onChange,
    medicines: providedMedicines,
    isLoading: providedLoading,
    disabled = false,
    className = "",
    error,
    label = "Medicine",
    required = false
}: {
    value?: IMedicine | string | null;
    onChange?: (medicineId: string, medicine?: IMedicine) => void;
    medicines?: IMedicine[];
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    error?: string;
    label?: string;
    required?: boolean;
}) => {
    const { data: allMedsRes, isLoading: loadingAll } = useGetAllMedicinesQuery(undefined, {
        skip: !!providedMedicines
    });
    const [getMedicineSuggestions, { isFetching }] = useLazyGetMedicineSuggestionsQuery();
    const [searchResults, setSearchResults] = useState<IMedicine[] | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const allMedicines: IMedicine[] = (providedMedicines || allMedsRes?.data || []).filter(
        (m: IMedicine) => !m.isDeleted
    );
    const isLoading = providedLoading ?? (providedMedicines ? false : loadingAll);

    const activeMedicines = searchResults !== null ? searchResults : allMedicines;

    const handleInputChange = (inputValue: string) => {
        if (!inputValue.trim()) {
            setSearchResults(null);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await getMedicineSuggestions(inputValue.trim());
                setSearchResults(res.data?.data || []);
            } catch {
                setSearchResults([]);
            }
        }, 350);
    };

    const selectedId = typeof value === "object" && value !== null ? value._id || "" : (value as string) || "";
    const selectedMed = activeMedicines.find((m) => m._id === selectedId) || (typeof value === "object" ? (value as IMedicine) : undefined);

    const formattedValue: SelectOption | null = selectedId
        ? {
              value: selectedId,
              label: selectedMed?.name || selectedId,
              medicine: selectedMed
          }
        : null;

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}
            <Select<SelectOption, false>
                unstyled
                isDisabled={disabled || isLoading}
                isLoading={isLoading || isFetching}
                placeholder="Select or search medicine..."
                isClearable
                options={activeMedicines.map((m) => ({
                    value: m._id || "",
                    label: m.name,
                    medicine: m
                }))}
                value={formattedValue}
                onInputChange={handleInputChange}
                onChange={(selected) => {
                    if (!selected) {
                        onChange?.("", undefined);
                        return;
                    }
                    const med = selected.medicine || activeMedicines.find((m) => m._id === selected.value);
                    onChange?.(selected.value, med);
                }}
                components={{
                    Control: MedicineControl,
                    DropdownIndicator: CustomDropdownIndicator,
                    ClearIndicator: CustomClearIndicator,
                    LoadingIndicator: CustomLoadingIndicator,
                    Option: CustomOption,
                    NoOptionsMessage: CustomNoOptionsMessage
                }}
                classNames={{
                    control: ({ isFocused }) =>
                        `flex items-center min-h-[38px] rounded-xl border transition-all cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                            error
                                ? "border-rose-400 dark:border-rose-600"
                                : isFocused
                                ? "border-emerald-600 ring-2 ring-emerald-100 dark:ring-emerald-950/50"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        } ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""}`,
                    menu: () =>
                        "mt-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100",
                    menuList: () => "p-1 space-y-1 max-h-56 overflow-y-auto",
                    placeholder: () => "text-slate-400 dark:text-slate-500 text-xs font-medium",
                    singleValue: () => "text-slate-900 dark:text-slate-100 text-xs font-semibold truncate",
                    input: () => "text-slate-900 dark:text-white text-xs font-semibold",
                    valueContainer: () => "px-2 py-1 flex-1 flex items-center gap-1.5 text-xs overflow-hidden",
                    indicatorsContainer: () => "flex items-center gap-1 pr-1.5 shrink-0"
                }}
            />
            {error && <p className="text-[11px] font-semibold text-rose-500">{error}</p>}
        </div>
    );
};

export const MedicineSelect = ({ name, control, ...rest }: Props) => {
    if (name && control) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <MedicineSelectContent
                        {...rest}
                        value={field.value}
                        onChange={(id, med) => {
                            field.onChange(id);
                            rest.onChange?.(id, med);
                        }}
                    />
                )}
            />
        );
    }

    return <MedicineSelectContent {...rest} />;
};

export default MedicineSelect;
