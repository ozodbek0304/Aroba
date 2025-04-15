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
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

export function MultiCombobox({
    data,
    values,
    setValues,
    label,
    disabled,
    isError,
    returnVal = "value",
}: {
    data: { label: string | number; value: string | number }[] | undefined
    values?: (string | number)[]
    setValues: (val: (string | number)[]) => void
    label: string
    disabled?: boolean
    isError?: boolean
    returnVal?: "value" | "label"
}) {
    const [open, setOpen] = useState(false)

    const handleSelect = (selectedItem: {
        label: string | number
        value: string | number
    }) => {
        const newValue =
            returnVal === "label" ? selectedItem.label : selectedItem.value
        const updatedValues =
            values?.find((v) => v === newValue) ?
                values?.filter((v) => v !== newValue)
                : (values || []).concat(newValue)
        setValues(updatedValues)
    }


    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between",
                        isError && "!text-destructive",
                    )}
                    disabled={disabled}
                >
                    {values?.length && values?.length < 3 ?
                        data
                            ?.filter((d) => values?.includes(d[returnVal]))
                            .map((d) => d.label)
                            .join(", ")
                        : values?.length ?
                            values?.length + " ta tanlandi"
                            : label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command>
                    <CommandInput placeholder={label} className="h-10" />
                    <CommandList>
                        <CommandEmpty>Mavjud emas</CommandEmpty>
                        <CommandGroup className="!overflow-y-scroll">
                            {data?.map((d, i: number) => (
                                <CommandItem
                                    key={i}
                                    onSelect={() => handleSelect(d)}
                                >
                                    {d.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            values?.includes(d[returnVal]) ?
                                                "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
