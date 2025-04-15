import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRequest } from "@/hooks/useRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useQueryClient } from "@tanstack/react-query"
import { useSearch } from "@tanstack/react-router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormInput from "@/components/form/input"
import { FormSelect } from "@/components/form/select"
import { useClients } from "@/constants/useClients"
import { useRoutes } from "@/constants/useRoutes"
import { toast } from "sonner"

interface thisProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    current: any
}

export default function ControlModal({ open, setOpen, current }: thisProps) {
    const queryClient = useQueryClient()
    const search: any = useSearch({ from: "/_main" })

    const { put, isPending } = useRequest()
    const clients = useClients().clients
    const client = clients?.find((c) => c.label === current?.client)?.id

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        disabled: isPending,
    })

    const { loadingRoutes, unloadingRoutes } = useRoutes(
        client || form.watch("client"),
    )

    useEffect(() => {
        if (current) {
            form.reset({
                ...current,
                client,
                loading: loadingRoutes?.find(
                    (c) => c.label === current?.loading,
                )?.value,
                unloading: unloadingRoutes?.(
                    loadingRoutes?.find((c) => c.label == current?.loading)
                        ?.value!,
                )?.find((c) => c.label === current?.unloading)?.value,
            })
        }
    }, [current, form])

    function handleClose() {
        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [open, form])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await put(`checkout/summary/${current?.id}/`, { ...current, ...data })
        toast.success("Muvaffaqiyatli o'zgartirildi")
        setOpen(false)
        queryClient.setQueryData(
            ["checkout/summary/", { ...search, payment_type: search.type }],
            (oldData: { total_pages: number; results: any[] }) => ({
                ...oldData,
                results: oldData.results.map((o) => {
                    if (o.id == current?.id) {
                        return {
                            ...o,
                            ...data,
                            income: data?.income || current?.income,
                            total_amount:
                                data?.total_amount || current?.total_amount,
                            client: clients?.find((c) => c.id == data.client)
                                ?.label,
                            loading: loadingRoutes?.find(
                                (c) => c.value == data.loading,
                            )?.label,
                            unloading: unloadingRoutes(data.loading)?.find(
                                (c) => c.value == data.unloading,
                            )?.label,
                        }
                    }
                    return o
                }),
            }),
        ),
            queryClient.invalidateQueries({
                queryKey: ["checkout/balance-info/"],
            })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reyestr</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Reyestr</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 max-h-[90vh] overflow-y-auto px-0.5"
                >
                    <FormSelect
                        control={form.control}
                        name="client"
                        label="Buyurtmachi"
                        options={useClients().clients}
                    />
                    <FormSelect
                        control={form.control}
                        name="loading"
                        label="Yuklash manzili"
                        options={loadingRoutes}
                    />
                    <FormSelect
                        control={form.control}
                        name="unloading"
                        label="Tushirish manzili"
                        options={unloadingRoutes(form.watch("loading"))}
                    />
                    <FormInput
                        methods={form}
                        name="car_number"
                        label="Avtomobil raqami"
                    />
                    <FormNumberInput
                        control={form.control}
                        thousandSeparator=" "
                        name="income"
                        label="Kirim"
                    />
                    <FormNumberInput
                        control={form.control}
                        thousandSeparator=" "
                        name="total_amount"
                        label="Chiqim"
                    />
                    <FormSelect
                        control={form.control}
                        name="payment_type"
                        returnVal="value"
                        options={[
                            {
                                label: "Naqd",
                                value: "cash",
                            },
                            {
                                label: "Pul o'tkazma",
                                value: "transfer",
                            },
                        ]}
                    />
                    <div className="flex gap-4 justify-end">
                        <Button loading={isPending}>Tasdiqlash</Button>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={handleClose}
                        >
                            Bekor qilish
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const FormSchema = z.object({
    client: z.number().min(1).or(z.string().min(1)),
    loading: z.number().min(1).or(z.string().min(1)),
    unloading: z.number().min(1).or(z.string().min(1)),
    car_number: z.string().min(1),
    income: z.string().or(z.number()),
    total_amount: z.string().or(z.number()),
    payment_type: z.string().min(1),
})
