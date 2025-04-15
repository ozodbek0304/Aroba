import { FormCarNumber } from "@/components/form/car-number"
import { FormNumberInput } from "@/components/form/number-input"
import { FormPhoneNumber } from "@/components/form/phone-number"
import { FormSearchCombobox } from "@/components/form/search-combobox"
import { FormSelect } from "@/components/form/select"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useClients } from "@/constants/useClients"
import { useRoutes } from "@/constants/useRoutes"
import { useRequest } from "@/hooks/useRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const FillModal = ({
    open,
    setOpen,
    current,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    current?: FillingOrder
}) => {
    const queryClient = useQueryClient()
    const search: any = useSearch({ from: "/_main" })
    const { patch, isPending } = useRequest()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            ...current,
            client: current?.client.id,
            loading: current?.loading?.id,
            unloading: current?.unloading?.id,
            driver_phone: current?.driver_phone,
        } as any,
        disabled: isPending,
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await patch(`dispatchers/fill-order/${current?.id}/`, data)
        queryClient.setQueryData(
            ["dispatchers/filling-orders/", search],
            (oldData: { total_pages: number; results: FillingOrder[] }) => ({
                ...oldData,
                results: oldData?.results?.map((o) =>
                    o.id === current?.id ? { ...o, ...data, status: "3" } : o,
                ),
            }),
        )
        setOpen(false)
        form.reset()
        toast.success("Muvaffaqiyatli tasdiqlandi")
    }

    const navigate = useNavigate()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Buyurtm to'ldirish</DialogTitle>
                    <VisuallyHidden>Buyurtma to'ldirish</VisuallyHidden>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormSelect
                        control={form.control}
                        name="client"
                        options={useClients().clients}
                        label="Buyurtmachi"
                        disabled
                    />
                    <div className="flex gap-4">
                        <FormSelect
                            control={form.control}
                            name="loading"
                            options={
                                useRoutes(form.watch("client")).loadingRoutes
                            }
                            label="Qayerdan"
                            disabled
                        />
                        <FormSelect
                            control={form.control}
                            name="unloading"
                            options={useRoutes(
                                form.watch("client"),
                            ).unloadingRoutes(form.watch("loading"))}
                            label="Qayerga"
                            disabled
                        />
                    </div>
                    <div className="flex gap-4">
                        <FormSearchCombobox
                            control={form.control}
                            name="car_number"
                            label="Avtomobil raqami"
                            url="dispatchers/fill-contacts/"
                            onAdd={(val) =>
                                val == "other" ?
                                    navigate({ to: "/contacts" })
                                :   form.setValue("car_number", val)
                            }
                            setFullValue={(val) =>
                                form.setValue(
                                    "driver_phone",
                                    "998" + val?.phone,
                                )
                            }
                        />
                        <FormPhoneNumber
                            control={form.control}
                            name="driver_phone"
                            label="Haydovchi raqami"
                        />
                    </div>
                    <FormNumberInput
                        control={form.control}
                        name="total_amount"
                        label="Summa"
                        thousandSeparator=" "
                    />
                    <div className="flex gap-4 justify-end">
                        <Button loading={isPending} type="submit">
                            Yuborish
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                form.reset()
                            }}
                            variant="secondary"
                        >
                            Bekor qilish
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FillModal

const formSchema = z.object({
    client: z.string({ message: "" }).or(z.number().min(1)),
    loading: z.string({ message: "" }).or(z.number().min(1)),
    unloading: z.string({ message: "" }).or(z.number().min(1)),
    driver_phone: z
        .string({ message: "" })
        .length(12, {})
        .or(z.number().min(12).max(12)),
    car_number: z.string({ message: "" }),
    total_amount: z.string({ message: "" }).min(3),
})
