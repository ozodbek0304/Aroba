import { Controller, Control } from "react-hook-form"
import { Checkbox } from "../ui/checkbox"
import FieldLabel from "./form-label"
import FieldError from "./form-error"

export function FormCheckbox({
    name,
    label,
    disabled,
    control,
    required,
    hideError = true,
}: thisProps) {
    return (
        <div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled || field.disabled}
                            className=""
                            id={name}
                        />
                        <FieldLabel
                            htmlFor={name}
                            required={!!required}
                            isError={!!control._formState.errors?.[name]}
                            className="pb-0"
                        >
                            {label}
                        </FieldLabel>
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
    label: string
    disabled?: boolean
    control: Control<any>
    required?: boolean
    hideError?: boolean
}
