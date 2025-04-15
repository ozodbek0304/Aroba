import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select2"
import { Plus } from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"

export function ParamSelect({
    options,
    paramName,
    label,
    disabled,
    addNew,
    returnVal = "value",
    className,
}: {
    options: Item[] | undefined
    paramName: string
    label?: string
    disabled?: boolean
    addNew?: boolean
    isError?: boolean
    returnVal?: "value" | "label"
    className?: string
}) {
    const navigate = useNavigate()
    const search: any = useSearch({ from: "/_main" }) as Record<
        string,
        string | undefined
    >
    const currentValue = search[paramName]

    const handleSelect = (val: string | number) => {
        navigate({
            search: {
                ...search,
                [paramName]: ['all', 'all-type'].includes(val?.toString()) ? undefined : val,
            },
        })
    }

    return (
        <Select onValueChange={(val) => handleSelect(options?.find((o) => o[returnVal] == val)?.[returnVal] || '')} defaultValue={currentValue} disabled={disabled}>
            <SelectTrigger className={cn('w-max bg-transparent', className)}>
                <SelectValue placeholder={label || "Tanlang"} className="!text-muted-foreground" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option?.value?.toString()}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                    {addNew && (
                        <SelectItem
                            key="add"
                            value="other"
                        >
                            <div className="flex items-center gap-2">
                                <Plus />
                                Add new
                            </div>
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

type Item = {
    label: string | number
    value: string | number
}
