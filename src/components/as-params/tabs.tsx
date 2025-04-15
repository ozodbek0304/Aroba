import { PlusCircle } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ClassNameValue } from "tailwind-merge"

interface ParamTabsProps {
    options: Array<{
        value: string | number
        label: string | number
        content?: React.ReactNode
        badge?: number
        className?: ClassNameValue
    }>
    paramName?: string
    disabled?: boolean
    onAdd?: () => void
    dontCleanOthers?: boolean
}

const ParamTabs: React.FC<ParamTabsProps> = ({
    options,
    paramName = "tab",
    disabled = false,
    onAdd,
    dontCleanOthers = true,
}) => {
    const navigate = useNavigate()
    const search: any = useSearch({ from: "/_main" }) as Record<
        string,
        string | undefined
    >

    const currentTab = search[paramName] || options[0]?.value

    const handleTabChange = (tab: string) => {
        if (tab === "add") {
            onAdd?.()
        } else {
            if (disabled || tab === currentTab) return
            dontCleanOthers ?
                navigate({ search: { ...search, [paramName]: tab } as any })
                : navigate({ search: { [paramName]: tab } as any })
        }
    }

    return (
        <div className="h-10 overflow-y-hidden">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList>
                    {options.map((option) => (
                        <TabsTrigger
                            key={option.value}
                            value={option.value?.toString()}
                            className={`cursor-pointer relative ${option.className}`}
                            aria-current={
                                option.value === currentTab ? "page" : undefined
                            }
                            disabled={disabled}
                        >
                            {option.label}
                            {!!option.badge && (
                                <Badge className="rounded-full absolute -top-3.5 -right-3.5 border-2 border-background z-50">
                                    {option.badge}
                                </Badge>
                            )}
                        </TabsTrigger>
                    ))}
                    {!!onAdd && (
                        <TabsTrigger value="add" asChild>
                            <Button
                                icon={<PlusCircle width={18} />}
                                variant="ghost"
                                className="!text-primary h-8"
                            />
                        </TabsTrigger>
                    )}
                </TabsList>
                {options.map((option) => (
                    <TabsContent
                        key={option.value}
                        value={option.value?.toString()}
                    >
                        {option.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default ParamTabs
