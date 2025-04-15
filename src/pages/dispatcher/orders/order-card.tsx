import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    ArrowRight,
    CalendarDays,
    Clock,
    Plus,
    Trash2,
    Undo2,
    UserRound,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import useTimer from "./timer2"
import http from "@/lib/http"
import useCan from "@/hooks/useCan"
import { useUser } from "@/constants/useUser"
import { useRequest } from "@/hooks/useRequest"
import { usePrompt } from "@/hooks/usePrompt"

const OrderCard = ({ c }: thisProps) => {
    const { info } = useUser()

    const { remove } = useRequest()
    const prompt = usePrompt()

    const canBand = useCan("dispatchers/book-order/$/")
    const canDelete = useCan("managers/delete-order/$/")

    const { hours, minutes } = useTimer({ created_at: c.created_at })

    async function band() {
        toast.promise(http.get(`dispatchers/book-order/${c.id}/`), {
            loading: "Band qilinmoqda",
            success: "Muvaffaqiyatli band qilindi",
            error: (error) =>
                error?.response?.data?.detail || "Xatolik yuz berdi",
        })
    }

    async function undo() {
        toast.promise(http.get(`dispatchers/book-order/${c.id}/`), {
            loading: "Qaytarilmoqda",
            success: "Muvaffaqiyatli qaytarildi",
            error: (error) =>
                error?.response?.data?.detail || "Xatolik yuz berdi",
        })
    }

    async function deleteOrder() {
        const comment = await prompt()
        if (comment) {
            toast.promise(
                remove(`managers/delete-order/${c.id}/`, { comment }),
                {
                    loading: "O'chirilmoqda",
                    success: "Muvaffaqiyatli o'chirildi",
                    error: (error) =>
                        error?.response?.data?.detail || "Xatolik yuz berdi",
                },
            )
        }
    }

    return (
        <Card
            className={
                "relative flex flex-col justify-between overflow-hidden text-sm"
            }
        >
            <CardContent className={"p-4 flex flex-col gap-3"}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <UserRound
                            width={18}
                            className="text-muted-foreground"
                        />
                        <span className="text-primary text-xs ">
                            {c.client}
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
                    <p className="font-medium text-mine">{c.loading}</p>
                    <ArrowRight width={20} className="text-primary" />
                    <p className="font-medium text-mine">{c.unloading}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="rounded-md bg-secondary flex items-center gap-1.5 px-2 py-1 w-max">
                        <Clock width={16} className="text-muted-foreground" />
                        {hours > 0 ? `${hours} soat` : ""}{" "}
                        {minutes < 10 ? `${minutes}` : minutes} minut
                    </div>
                    {c.payment_type === "cash" ?
                        <div className="rounded-md bg-secondary flex items-center gap-1.5 px-2 h-8 w-max">
                            <img src="/cash.svg" alt="" />
                        </div>
                    :   <img src="/transfer.svg" alt="" />}
                </div>
                <p className="text-muted-foreground">{c.comment}</p>
            </CardContent>
            {canBand && (
                <>
                    {c?.dispatcher?.id ?
                        <CardFooter className="pt-0 flex gap-2">
                            {canDelete && (
                                <div>
                                    <Button
                                        icon={
                                            <Trash2
                                                width={16}
                                                size="sm"
                                                className="!text-destructive"
                                            />
                                        }
                                        variant="ghost"
                                        onClick={deleteOrder}
                                    />
                                </div>
                            )}
                            {info?.id === c?.dispatcher?.id ?
                                <Button
                                    icon={<Undo2 width={16} />}
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={undo}
                                >
                                    Qaytarish
                                </Button>
                            :   <Button
                                    className={cn("w-full")}
                                    size="sm"
                                    variant="ghost"
                                >
                                    {c?.dispatcher?.first_name}{" "}
                                    {c?.dispatcher?.last_name}
                                </Button>
                            }
                        </CardFooter>
                    :   <CardFooter className="pt-0">
                            <Button
                                className={cn("w-full")}
                                size="sm"
                                icon={<Plus size={16} />}
                                onClick={band}
                            >
                                Band qilish
                            </Button>
                        </CardFooter>
                    }
                </>
            )}
        </Card>
    )
}

export default OrderCard

interface thisProps {
    c: Order
}
