import { Controller, Control } from "react-hook-form"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { ClassNameValue } from "tailwind-merge"
import SeeMore from "../ui/see-more"

export function FormImagePicker({
    name,
    label,
    disabled,
    required,
    control,
    setValue,
    hideError = true,
    className
}: ImagePickerProps) {
    return (
        <div className="w-full flex flex-col items-center">
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="relative">
                        <SeeMore d={{ images: [{ image: field.value instanceof File ? URL.createObjectURL(field.value) : field.value }] }}>
                            <Avatar className={`${className}`}>
                                <AvatarImage
                                    src={field.value ? (field.value instanceof File ? URL.createObjectURL(field.value) : field.value) : undefined}
                                    alt="Selected Image"
                                    className="object-cover"
                                />
                                <AvatarFallback>Rasm</AvatarFallback>
                            </Avatar>
                        </SeeMore>
                        <input
                            type="file"
                            id={name}
                            accept="image/*"
                            disabled={disabled}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setValue?.(file);
                                    field.onChange(file);
                                }
                            }}
                            hidden
                        />
                    </div>
                )
                }
            />
            {
                label && (
                    <FieldLabel
                        htmlFor={name}
                        required={!!required}
                        isError={!!control._formState.errors?.[name]}
                    >
                        {label}
                    </FieldLabel>
                )
            }
            {
                !hideError && control._formState.errors?.[name] && (
                    <FieldError>
                        {control._formState.errors[name]?.message as string}
                    </FieldError>
                )
            }
        </div >
    )
}

interface ImagePickerProps {
    name: string
    label?: string
    disabled?: boolean
    required?: boolean
    setValue?: (val: File) => void
    control: Control<any>
    hideError?: boolean
    className?: ClassNameValue
}