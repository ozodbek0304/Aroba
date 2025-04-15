import { FieldValues, Path, RegisterOptions, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import FieldLabel from "./form-label";
import FieldError from "./form-error";
import { Input } from "../ui/input";
import { ClassNameValue } from "tailwind-merge";

interface IProps<IForm extends FieldValues> {
    methods: UseFormReturn<IForm>;
    name: Path<IForm>;
    label?: string;
    required?: boolean;
    registerOptions?: RegisterOptions<IForm>;
    wrapperClassName?: ClassNameValue;
    hideError?: boolean;
    suffix?: React.ReactNode;
}

export function FormInput<IForm extends FieldValues>({
    methods,
    name,
    label,
    required = false,
    registerOptions,
    wrapperClassName,
    className,
    type = "text",
    hideError = true,
    suffix,
    ...props
}: IProps<IForm> & React.InputHTMLAttributes<HTMLInputElement>) {
    const {
        register,
        formState: { errors },
    } = methods

    const reg = register(name, {
        required: {
            value: required,
            message: methods.formState.errors[name]?.message as any,
        },
        ...registerOptions,
        disabled: props.disabled,
    })

    const { disabled, ...otherProps } = props

    return (
        <fieldset className={cn("flex flex-col w-full", wrapperClassName)}>
            {label && (
                <FieldLabel
                    htmlFor={name}
                    required={required}
                    isError={!!errors?.[name]}
                >
                    {label}
                </FieldLabel>
            )}
            <Input
                type={type}
                {...reg}
                {...otherProps}
                disabled={disabled || methods.formState.disabled}
                placeholder={props.placeholder || label}
                id={name}
                fullWidth
                className={
                    !!errors?.[name] && !label ?
                        "border-destructive focus:border-border !ring-destructive"
                        : ""
                }
                suffix={suffix}
            />
            {!hideError && errors[name] && (
                <FieldError>{errors[name]?.message as string}</FieldError>
            )}
        </fieldset>
    )
}

export default FormInput
