import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { ClassNameValue } from "tailwind-merge"

interface IProps {
    children: ReactNode
    required: boolean
    htmlFor?: string
    isError: boolean,
    className?: ClassNameValue
}

export default function FieldLabel({
    children,
    htmlFor,
    isError,
    className
}: IProps) {
    return (
        <label className={cn("font-medium select-none leading-[1.4] pb-2 text-sm cursor-pointer", isError && "text-destructive", className)} htmlFor={htmlFor}>
            {children}
        </label>
    )
}
