import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRequest } from "@/hooks/useRequest"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export function ChangeMoneyStatus({ open, setOpen, current, type }: thisProps) {
    const { post, isPending } = useRequest({
        onSuccess: () => {
            toast.success("Muvaffaqiyatli o'zgartirild")
            setOpen(false)
        },
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        disabled: isPending,
    })

    const [type2, setType2] = useState<
        "cash" | "card" | "summa_perechisleniya"
    >("cash")

    useEffect(() => {
        setType2(
            current?.cash > 0 && type !== "cash" ? "cash"
            : current?.card > 0 && type !== "card" ? "card"
            : (
                type !== "summa_perechisleniya" &&
                current?.summa_perechisleniya > 0
            ) ?
                "summa_perechisleniya"
            :   "card",
        )
    }, [current, type])

    useEffect(() => {
        form.setValue("amount", current?.[type2]?.toString())
    }, [form, current, type2])
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (+data.amount > 0 && +data.amount <= current?.[type2]) {
            await post("order/change-amount/" + current.id + "/", {
                amount: +data.amount,
                from_field: type2,
                to_field: type,
            })
        } else {
            toast.error("Summani to'g'ri kiriting")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="hidden">
                        Summani o'zgartirish
                    </DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            Summani o'zgartirish
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <RadioGroup
                    className="flex gap-4 w-full overflow-x-auto pb-2"
                    value={type2}
                    onValueChange={(val: string) => setType2(val as any)}
                >
                    <div className="flex items-center space-x-2 w-auto">
                        <RadioGroupItem
                            value={"cash"}
                            id="cash"
                            className="w-4"
                            disabled={current.cash === 0 || type === "cash"}
                        />
                        <Label
                            htmlFor={"cash"}
                            className={cn(
                                "cursor-pointer",
                                (current.cash === 0 || type === "cash") &&
                                    "opacity-50 cursor-not-allowed",
                            )}
                        >
                            Naqd
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 w-auto">
                        <RadioGroupItem
                            value={"card"}
                            id="card"
                            className="w-4"
                            disabled={current.card === 0 || type === "card"}
                        />
                        <Label
                            htmlFor={"card"}
                            className={cn(
                                "cursor-pointer",
                                (current.card === 0 || type === "card") &&
                                    "opacity-50 cursor-not-allowed",
                            )}
                        >
                            Plastik
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 w-auto">
                        <RadioGroupItem
                            value={"summa_perechisleniya"}
                            id="perechisleniya"
                            className="w-4"
                            disabled={
                                current.summa_perechisleniya === 0 ||
                                type === "summa_perechisleniya"
                            }
                        />
                        <Label
                            htmlFor={"perechisleniya"}
                            className={cn(
                                "cursor-pointer",
                                (current.summa_perechisleniya === 0 ||
                                    type === "summa_perechisleniya") &&
                                    "opacity-50 cursor-not-allowed",
                            )}
                        >
                            Perechisleniya
                        </Label>
                    </div>
                </RadioGroup>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" space-y-4"
                >
                    <FormNumberInput
                        control={form.control}
                        name="amount"
                        label="Summa"
                        placeholder="Summa"
                        thousandSeparator=" "
                    />
                    <Button
                        type="submit"
                        loading={isPending}
                        className="w-full"
                    >
                        Tasdiqlash
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const FormSchema = z.object({
    amount: z
        .string({ message: "Summani kiriting" })
        .min(3, { message: "Summani kiriting" }),
})

interface thisProps {
    open: boolean
    setOpen: (val: boolean) => void
    current: Status
    type: "cash" | "card" | "summa_perechisleniya"
}
