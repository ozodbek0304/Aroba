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
import { useEffect, useState } from "react"
import { ClassNameValue } from "tailwind-merge"
import { useGet } from "@/hooks/useGet"

export function SearchCombobox({
    value,
    setValue,
    label,
    disabled,
    isError,
    className,
    url,
    setFullValue,
}: {
    value: string | number | null
    setValue: (val: any) => void
    setFullValue?: (val: any) => void
    label: string
    disabled?: boolean
    addNew?: boolean
    isError?: boolean
    returnVal?: "value" | "label"
    className?: ClassNameValue
    url: string
}) {
    const [open, setOpen] = useState(false)
    const [val, setVal] = useState("")
    const [lastVal, setLastVal] = useState("")

    const handleSelect = (option: string) => {
        setValue(option)
        setOpen(false)
    }

    const { data } = useGet<{ truck_id: string }[]>(url, {
        search: lastVal,
    })

    useEffect(() => {
        setTimeout(() => {
            setLastVal(val)
        }, 300)
    }, [val])

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
                    {value ? value : label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command>
                    <CommandInput
                        placeholder={label}
                        value={val}
                        onValueChange={setVal}
                    />
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
                            {data?.map((d, i) => (
                                <CommandItem
                                    key={i}
                                    value={d.truck_id}
                                    onSelect={() => {
                                        handleSelect(d.truck_id)
                                        setFullValue?.(d)
                                    }}
                                >
                                    {d?.truck_id}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value == d.truck_id ?
                                                "opacity-100"
                                            :   "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                            <CommandItem
                                onSelect={() => {
                                    setValue("other")
                                    setOpen(false)
                                }}
                                value={val}
                            >
                                <Plus width={20} className="pr-1" /> Yangi
                                qo'shish
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
