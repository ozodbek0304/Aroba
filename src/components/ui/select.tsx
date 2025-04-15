import React from "react"
import {
    Select as Select2,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select2"
import { ClassNameValue } from "tailwind-merge"
const Select = ({
    value,
    setValue,
    options,
    label,
    className,
    disabled,
    returnVal = "value",
}: thisProps) => {
    return (
        <Select2
            disabled={disabled}
            value={value?.toString()}
            onValueChange={setValue}
        >
            <SelectTrigger className={`w-full bg-transparent ${className}`}>
                <SelectValue className={`${className}`} placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((s, i) => (
                        <SelectItem key={i} value={s[returnVal]?.toString()}>
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select2>
    )
}

export default Select

interface thisProps {
    value: string | number | null
    setValue: React.Dispatch<React.SetStateAction<string>>
    options?: { label: string | number; value: string | number }[]
    label: string
    className?: ClassNameValue
    disabled?: boolean
    returnVal?: "label" | "value"
}
