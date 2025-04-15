import { Controller, Control } from "react-hook-form"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import { SearchCombobox } from "../ui/search-combobox"

export function FormSearchCombobox({
    name,
    label,
    disabled,
    placeholder,
    required,
    control,
    hideError = true,
    returnVal = "value",
    url,
    onAdd,
    setFullValue,
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
                        <SearchCombobox
                            url={url}
                            value={field.value || ""}
                            setValue={(val) => {
                                if (val === "other") {
                                    onAdd?.("other")
                                } else {
                                    field.onChange(val)
                                }
                            }}
                            setFullValue={setFullValue}
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
    url: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    control: Control<any>
    hideError?: boolean
    returnVal?: "value" | "label"
    addNew?: boolean
    onAdd?: (val: string) => void
    setFullValue?: (val: any) => void
}
