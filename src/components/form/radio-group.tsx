import { Controller, Control } from "react-hook-form"
import FieldError from "./form-error"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { ClassNameValue } from "tailwind-merge"
import FieldLabel from "./form-label"

export function FormRadioGroup({
    name,
    disabled,
    control,
    hideError = true,
    options,
    className
}: thisProps) {
    return (
        <div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled || field.disabled}
                        className={`${className}`}
                    >
                        {options?.map((option) => <div className="flex items-center space-x-2" key={option.value}>
                            <RadioGroupItem value={option.value?.toString()} id={option.value?.toString()} />
                            <FieldLabel htmlFor={option.value?.toString()} required={false} isError={!!control._formState.errors?.[name]} className='pb-0'>
                                {option.label}
                            </FieldLabel>
                        </div>)}
                    </RadioGroup>
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
    disabled?: boolean
    control: Control<any>
    required?: boolean
    hideError?: boolean
    options?: { label: string | number; value: string | number }[]
    className?: ClassNameValue
}
