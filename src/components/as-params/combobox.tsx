import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CheckIcon, ChevronsUpDown, Plus, X } from "lucide-react"
import { useState } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"

export function ParamCombobox({
    options,
    paramName,
    label,
    disabled,
    addNew,
    isError,
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
    const [open, setOpen] = useState(false)

    const handleSelect = (option: Item) => {
        const val = returnVal === "label" ? option.label : option.value
        navigate({
            search: {
                ...search,
                [paramName]: val == currentValue ? undefined : val,
            },
        })
        setOpen(false)
    }

    const handleCancel = () => {
        navigate({ search: { ...search, [paramName]: undefined } })
        setOpen(false)
    }

    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between font-normal text-muted-foreground",
                        currentValue && "font-medium text-foreground",
                        isError && "!text-destructive",
                        className,
                    )}
                    disabled={disabled}
                >
                    {currentValue ?
                        options?.find((d) => d[returnVal] === currentValue)
                            ?.label || currentValue
                        : label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-0">
                <Command>
                    <div className="relative">
                        <CommandInput placeholder={label} />
                        {!!currentValue && (
                            <span className="absolute cursor-pointer text-destructive top-1.5 right-1 p-1">
                                <X
                                    className="text-destructive"
                                    width={16}
                                    onClick={handleCancel}
                                />
                            </span>
                        )}
                    </div>
                    <CommandList>
                        <CommandEmpty>Mavjud emas</CommandEmpty>
                        <CommandGroup>
                            {options?.map((d, i) => (
                                <CommandItem
                                    key={i}
                                    onSelect={() => handleSelect(d)}
                                >
                                    {d.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentValue === d[returnVal] ?
                                                "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                            {addNew && (
                                <CommandItem
                                    onSelect={() =>
                                        handleSelect({
                                            label: "New Item",
                                            value: -1,
                                        })
                                    }
                                >
                                    <Plus width={20} className="pr-1" /> Yangi
                                    qo'shish
                                    <CheckIcon
                                        className={cn("ml-auto h-4 w-4")}
                                    />
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

type Item = {
    label: string | number
    value: string | number
}
