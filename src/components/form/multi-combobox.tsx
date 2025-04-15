import { Controller, Control } from "react-hook-form"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import { MultiCombobox as ShadcnCombobox } from "@/components/ui/multi-combobox"

export function FormMultiCombobox({
    name,
    label,
    options,
    disabled,
    placeholder,
    required,
    control,
    hideError = true,
    returnVal = "label",
}: thisProps) {
    return (
        <div>
            {label && (
                <FieldLabel
                    htmlFor={name}
                    required={!!required}
                    isError={!!control._formState.errors?.[name]}
                >
                    {label}
                </FieldLabel>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="pt-0.5">
                        <ShadcnCombobox
                            data={options}
                            values={field.value}
                            setValues={field.onChange}
                            label={placeholder || label || "Select an option"}
                            disabled={control._formState.disabled || disabled}
                            isError={
                                !label && !!control._formState.errors?.[name]
                            }
                            returnVal={returnVal}
                        />
                    </div>
                )}
            />
            {!hideError && control._formState.errors?.[name] && (
                <FieldError>
                    {control._formState.errors[name]?.message as string}
                </FieldError>
            )}
        </div>
    )
}

interface thisProps {
    name: string
    label?: string
    placeholder?: string
    options: { label: string | number; value: string | number }[] | undefined
    disabled?: boolean
    required?: boolean
    control: Control<any>
    hideError?: boolean
    returnVal?: "value" | "label"
}
