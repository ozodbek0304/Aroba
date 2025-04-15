import { Controller, Control } from "react-hook-form"
import { DatePicker } from "@/components/ui/datepicker"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import { CalendarProps } from "../ui/calendar"


export function FormDatePicker({
    name,
    label,
    disabled,
    control,
    required = false,
    calendarProps,
}: thisProps) {
    return (
        <div className="flex flex-col">
            {label && (
                <FieldLabel
                    isError={!!control._formState.errors?.[name]}
                    htmlFor={name}
                    required={required}
                >
                    {label}
                </FieldLabel>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <DatePicker
                        calendarProps={{
                            ...calendarProps,
                            defaultMonth:
                                field.value ? new Date(field.value) : undefined,
                        }}
                        date={field.value ? new Date(field.value) : undefined}
                        setDate={field.onChange}
                        placeholder={label}
                        disabled={field.disabled || disabled}
                        fullWidth
                    />
                )}
            />
            {control._formState?.errors?.[name] && (
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
    calendarProps?: CalendarProps | undefined
}
