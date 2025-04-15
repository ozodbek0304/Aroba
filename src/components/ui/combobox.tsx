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
import { ClassNameValue } from "tailwind-merge"

export function Combobox({
    options,
    value,
    setValue,
    label,
    disabled,
    addNew,
    isError,
    returnVal = "value",
    className,
}: {
    options: Item[] | undefined
    value: string | number | null
    setValue: (val: any) => void
    label: string
    disabled?: boolean
    addNew?: boolean
    isError?: boolean
    returnVal?: "value" | "label"
    className?: ClassNameValue
}) {
    const [open, setOpen] = useState(false)

    const handleSelect = (option: Item) => {
        const returnValue = returnVal === "label" ? option.label : option.value
        setValue(returnValue)
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
                        "w-full justify-between bg-background font-normal text-muted-foreground",
                        value && "font-medium text-foreground",
                        isError && "!text-destructive",
                        className,
                    )}
                    disabled={disabled}
                >
                    {value ?
                        options
                            ?.find((d) => d.value == value)
                            ?.label?.toString() || value
                    :   label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command>
                    <CommandInput placeholder={label} />
                    {!!value && (
                        <span className="absolute cursor-pointer text-destructive top-1.5 right-1 p-1">
                            <X
                                className="text-destructive"
                                width={16}
                                onClick={() => setValue(null)}
                            />
                        </span>
                    )}
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
                                            value == d[returnVal] ?
                                                "opacity-100"
                                            :   "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                            {addNew && (
                                <CommandItem
                                    onSelect={() => {
                                        setValue(-1)
                                        setOpen(false)
                                    }}
                                >
                                    <Plus width={20} className="pr-1" /> Yangi
                                    qo'shish
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
