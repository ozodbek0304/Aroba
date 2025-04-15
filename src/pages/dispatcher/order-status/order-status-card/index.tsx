import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useRequest } from "@/hooks/useRequest"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import {
    ArrowRight,
    CalendarDays,
    Clock,
    MapPin,
    PhoneCall,
    RefreshCw,
    Trash2,
    Truck,
    Undo2,
    UserRound,
} from "lucide-react"
import { toast } from "sonner"
import { usePrompt } from "@/hooks/usePrompt"
import { format } from "date-fns"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import PopoverMap from "./popover-map"
import { useStatuses } from "@/constants/useStatuses"
import { useSearch } from "@tanstack/react-router"
import useCan from "@/hooks/useCan"
import { useConfirm } from "@/hooks/useConfirm"

const OrderCard = ({ c }: thisProps) => {
    const queryClient = useQueryClient()
    const search: any = useSearch({ from: "/_main" })
    const prompt = usePrompt()
    const confirm = useConfirm()

    const { patch, remove, isPending } = useRequest()

    async function changeStatus(id: string | number) {
        const isConfirmed =
            +id > 5 ? await confirm({ title: "Tasdiqlansinmi?" }) : true
        if (!isConfirmed) return
        await patch(`managers/status-orders/${c.id}/`, { status: id })
        queryClient.setQueryData(
            [
                "managers/status-orders/",
                {
                    ...search,
                    status: search.status === "all" ? undefined : search.status,
                },
            ],
            (oldData: { total_pages: number; results: Status[] }) => ({
                ...oldData,
                results:
                    id == 9 ?
                        oldData?.results?.filter((o) => o.id !== c?.id)
                    :   oldData?.results?.map((o) => {
                            if (o.id === c?.id) {
                                return { ...o, status: +id }
                            } else {
                                return o
                            }
                        }),
            }),
        )
        toast.success("Muvaffaqiyatli o'zgartirildi")
    }

    async function handleDelete() {
        const comment = await prompt()
        if (comment) {
            await remove(`managers/delete-order/${c.id}/`, { comment })
            queryClient.setQueryData(
                [
                    "managers/status-orders/",
                    {
                        ...search,
                        status:
                            search.status === "all" ? undefined : search.status,
                    },
                ],
                (oldData: { total_pages: number; results: Status[] }) => ({
                    ...oldData,
                    results: oldData?.results?.filter((o) => o.id !== c?.id),
                }),
            )
            toast.success("Muvaffaqiyatli o'chirildi")
        }
    }

    async function handleUndo() {
        const comment = await prompt()
        if (comment) {
            await patch(`managers/rollback-order/${c.id}/`, { comment })
            queryClient.setQueryData(
                [
                    "managers/status-orders/",
                    {
                        ...search,
                        status:
                            search.status === "all" ? undefined : search.status,
                    },
                ],
                (oldData: { total_pages: number; results: Status[] }) => ({
                    ...oldData,
                    results: oldData?.results?.filter((o) => o.id !== c?.id),
                }),
            )
            toast.success("Muvaffaqiyatli qaytarildi")
        }
    }

    const canChangeStatus = useCan("managers/status-orders/$/")
    const canDelete = useCan("managers/delete-order/$/")
    const canUndo = useCan("managers/rollback-order/$/")

    return (
        <Card
            className={cn(
                "relative flex flex-col justify-between overflow-hidden text-sm",
            )}
            loading={isPending}
        >
            <CardContent className={"p-4 flex flex-col gap-3"}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <UserRound
                            width={18}
                            className="text-muted-foreground"
                        />
                        <span className="text-primary text-xs ">
                            {c.client?.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarDays
                            width={16}
                            className="text-muted-foreground"
                        />
                        <span className="text-primary text-xs">
                            {format(new Date(c.date), "dd.MM.yy")}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center pb-1">
                    <p className="font-medium text-sm text-mine">
                        {c.loading?.name}
                    </p>
                    <ArrowRight width={20} className="text-primary" />
                    <p className="font-medium text-sm text-mine">
                        {c.unloading?.name}
                    </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="rounded-md bg-secondary flex items-center justify-center gap-1.5 px-2 py-1 w-full">
                        <Truck width={16} className="text-muted-foreground" />{" "}
                        <span className="text-xs text-mine font-semibold">
                            {c.car_number}
                        </span>
                    </div>
                    <div className="rounded-md bg-secondary flex items-center justify-center gap-1.5 px-2 h-8 w-full">
                        <PhoneCall
                            width={16}
                            className="text-muted-foreground"
                        />{" "}
                        <span className="text-xs text-nowrap text-mine font-semibold">
                            {formatPhoneNumber(c.driver_phone)}
                        </span>
                    </div>
                </div>
                {c.status < 5 && (
                    <div className="flex items-center justify-between gap-2">
                        <DropdownMenu>
                            {canChangeStatus && (
                                <DropdownMenuTrigger className="w-full">
                                    <div className="rounded-md bg-secondary flex items-center justify-center gap-1.5 px-2 py-1 w-full text-primary">
                                        <RefreshCw width={16} />{" "}
                                        <span className="text-xs font-semibold text-nowrap">
                                            {
                                                useStatuses()?.find(
                                                    (u) => +u.value == c.status,
                                                )?.label
                                            }
                                        </span>
                                    </div>
                                </DropdownMenuTrigger>
                            )}
                            <DropdownMenuContent>
                                {useStatuses({
                                    from: c.status?.toString(),
                                })?.map((u) => (
                                    <DropdownMenuItem
                                        key={u.value}
                                        onClick={() => changeStatus(u.value)}
                                    >
                                        {u.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Popover>
                            <PopoverTrigger className="w-full">
                                <div className="rounded-md bg-secondary flex items-center justify-center gap-1.5 px-2 h-8 w-full text-primary">
                                    <MapPin width={16} />{" "}
                                    <span className="text-xs text-nowrap font-semibold">
                                        Lokatsiya
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[300px] h-auto sm:w-[600px] aspect-[3/2]">
                                <PopoverMap
                                    userData={{
                                        long: c.unloading?.lon,
                                        lat: c.unloading?.lat,
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-0 flex items-center gap-2 -mt-2">
                {c.status < 5 && canDelete && (
                    <Button
                        icon={<Trash2 width={16} />}
                        size="sm"
                        className="w-full"
                        variant="secondary"
                        onClick={handleDelete}
                    >
                        O'chirish
                    </Button>
                )}
                {c.status < 5 && canUndo && (
                    <Button
                        icon={<Undo2 width={16} />}
                        size="sm"
                        className="w-full !bg-green-500"
                        onClick={handleUndo}
                    >
                        Qaytarish
                    </Button>
                )}
                {c.status == 5 && canChangeStatus && (
                    <Button
                        icon={<MapPin width={16} />}
                        size="sm"
                        className="w-full !bg-green-500"
                        onClick={() => changeStatus(6)}
                    >
                        Lokatsiya berildi
                    </Button>
                )}
                {c.status == 6 && canChangeStatus && (
                    <Button
                        icon={<Clock width={16} />}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                    >
                        To'lov qilinishi kutilmoqda
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default OrderCard

interface thisProps {
    c: Status
    selecteds: number[]
    setSelecteds: React.Dispatch<React.SetStateAction<number[]>>
    loading: boolean
}
