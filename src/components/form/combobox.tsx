import { Controller, Control } from "react-hook-form"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import { Combobox as ShadcnCombobox } from "@/components/ui/combobox"

export function FormCombobox({
    name,
    label,
    options,
    disabled,
    placeholder,
    required,
    control,
    setValue,
    hideError = true,
    returnVal = "value",
}: thisProps) {
    return (
        <div className="w-full">
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
                    <div className={label ? "pt-1" : ""}>
                        <ShadcnCombobox
                            options={options}
                            value={field.value || ""}
                            setValue={(val) => {
                                if (val === "other") {
                                    setValue?.("other")
                                } else {
                                    field.onChange(val)
                                }
                            }}
                            label={placeholder || label || "Tanlang"}
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
    setValue?: (val: string | number) => void
    control: Control<any>
    hideError?: boolean
    returnVal?: "value" | "label"
}
