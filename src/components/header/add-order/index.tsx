import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { FormCombobox } from "@/components/form/combobox"
import { FormNumberInput } from "@/components/form/number-input"
import { FormInput } from "@/components/form/input"
import { useClients } from "@/constants/useClients"
import { useRoutes } from "@/constants/useRoutes"

export default function AddOrder() {
    const [open, setOpen] = useState(false)

    const queryClient = useQueryClient()
    const { post, isPending } = useRequest()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        disabled: isPending,
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await post("orders/create-order/", data)
        setOpen(false)
        queryClient.refetchQueries({ queryKey: ["dispatchers/new-orders/"] })
        form.resetField("unloading")
        toast.success("Muvaffaqiyatli qo'shildi")
    }

    const clientId = form.watch('client')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="fixed lg:static rounded-full h-10 w-12 !box-border lg:w-auto lg:h-10 2xl:h-10  lg:rounded-md  bottom-32 right-4 sm:bottom-20 sm:right-20 shadow-lg z-50"
                    onClick={() => setOpen(true)}
                    icon={<Plus width={18} />}
                >
                    <span className="hidden lg:inline">Buyurtma</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md pb-6">
                <DialogHeader>
                    <DialogTitle className="text-left">
                        Yangi buyurtma
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormCombobox
                            name="client"
                            label="Buyurtmachi"
                            options={useClients().clients}
                            control={form.control}
                        />
                        <div className="flex items-center gap-4">
                            <FormCombobox
                                name="loading"
                                label="Yuklash manzili"
                                options={useRoutes(clientId).loadingRoutes}
                                control={form.control}
                                disabled={!form.watch('client')}
                            />
                            <FormCombobox
                                name="unloading"
                                label="Yetkazish manzili"
                                options={useRoutes(clientId).unloadingRoutes(form.watch('loading'))}
                                control={form.control}
                                disabled={!form.watch('client')}
                            />
                        </div>
                        <FormNumberInput
                            name="car_count"
                            label="Mashinalar soni"
                            control={form.control}
                        />
                        <FormInput
                            name="comment"
                            label="Qo'shimcha ma'lumot"
                            methods={form}
                        />
                        <Button
                            icon={<Plus width={18} />}
                            type="submit"
                            loading={isPending}
                        >
                            Qo'shish
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const FormSchema = z
    .object({
        client: z.number({ message: "" }),
        loading: z.number({ message: "" }),
        unloading: z.number({ message: "" }),
        car_count: z.string({ message: "" }).min(1),
        comment: z
            .string({ message: "Izoh qoldiring" })
            .nonempty({ message: "" }),
    })
