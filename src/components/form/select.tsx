import { Controller, Control } from "react-hook-form"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import Select from "../ui/select"

export function FormSelect({
    name,
    label,
    options,
    disabled,
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
                        <Select
                            options={options}
                            label={label || 'Tanlang'}
                            value={field.value?.toString()}
                            setValue={(val) => val === 'other' ? setValue?.(val) : field.onChange(val)}
                            returnVal={returnVal}
                            disabled={field.disabled || disabled}
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
    options?: { label: string | number; value: string | number }[]
    disabled?: boolean
    required?: boolean
    setValue?: (val: string | number) => void
    control: Control<any>
    hideError?: boolean
    returnVal?: "value" | "label"
}
