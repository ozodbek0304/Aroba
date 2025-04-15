import {
    Control,
    FieldValues,
    Path,
    RegisterOptions,
    useController,
} from "react-hook-form"
import { cn } from "@/lib/utils"
import { PatternFormat, PatternFormatProps } from "react-number-format"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import { ClassNameValue } from "tailwind-merge"

interface IProps<IForm extends FieldValues> {
    control: Control<IForm>
    name: Path<IForm>
    label?: string
    required?: boolean
    registerOptions?: RegisterOptions<IForm>
    formatOptions?: Intl.NumberFormatOptions
    wrapperClassName?: string
    thousandSeparatmor?: string
    decimalSeparator?: string
    hideError?: boolean
    format?: string,
    props?: PatternFormatProps,
    className?: ClassNameValue,
    placeholder?: string,
    disabled?: boolean
}

export function FormPhoneNumber<IForm extends FieldValues>({
    control,
    name,
    label,
    required = false,
    registerOptions,
    wrapperClassName,
    className,
    formatOptions,
    hideError = true,
    format = "+###  ##  ###  ##  ##",
    placeholder = "Telefon raqamini kiriting",
    disabled,
    ...props
}: IProps<IForm>) {
    const {
        field: { onChange, ref, ...field },
        fieldState,
    } = useController({
        name,
        control
    })

    return (
        <fieldset className={cn("flex flex-col w-full", wrapperClassName)}>
            {label && (
                <FieldLabel
                    htmlFor={name}
                    required={required}
                    isError={!!fieldState.error}
                >
                    {label}
                </FieldLabel>
            )}
            <label className="relative flex items-center">
                <PatternFormat
                    format={format}
                    id={name}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        className,
                        control._formState.errors?.[name] &&
                        !label &&
                        "border-destructive focus:border-border !ring-destructive",
                    )}
                    onValueChange={(val) => {
                        onChange(val.value)
                    }}
                    getInputRef={ref}
                    {...field}
                    {...props}
                    placeholder={placeholder || label}
                    disabled={field.disabled || disabled}
                />
            </label>
            {fieldState.error && !hideError && (
                <FieldError>{fieldState.error?.message}</FieldError>
            )}
        </fieldset>
    )
}
