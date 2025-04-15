import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import { FormPhoneNumber } from "@/components/form/phone-number"
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
import { toast } from "sonner"
import { z } from "zod"

export function CheckModal(props: thisProps) {
    const { patch, isPending } = useRequest()
    const queryClinet = useQueryClient()
    const search: any = useSearch({ from: "/_main" })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        disabled: isPending,
        values: {
            accountant_number: props.d?.accounting_phone,
            inn: "",
            customer: "",
        },
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await patch(`accountant/clients/${props.d.id}/`, data)
        props.setOpen(false)
        toast.success("Muvaffaqiyatli tasdiqlandi")
        queryClinet.setQueryData(
            ["accountant/clients/", search],
            (oldData: { total_pages: number; results: Client[] }) => ({
                ...oldData,
                results: oldData.results.filter((f) => f.id !== props.d.id),
            }),
        )
    }

    function handleClose() {
        props.setOpen(false)
        form.reset()
    }

    useEffect(() => {
        if (!props.open) {
            form.reset()
        }
    }, [props.open, form])
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Shartnoma ma'lumotlari</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            Shartnoma ma'lumotlari
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormInput
                        methods={form}
                        name={"customer"}
                        label={"Tashuvchi nomi"}
                    />
                    <FormNumberInput
                        control={form.control}
                        name="inn"
                        label={"INN"}
                    />
                    <FormPhoneNumber
                        control={form.control}
                        name={"accountant_number"}
                        label="Buxgalter raqami"
                    />
                    <div className="flex gap-4 justify-end">
                        <Button>Tasdiqlash</Button>
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

interface thisProps {
    open: boolean
    setOpen: (open: boolean) => void
    d: MakeContractData
}

const FormSchema = z.object({
    customer: z.string({ message: "" }).nonempty({ message: "" }),
    inn: z
        .string({ message: "" })
        .nonempty({ message: "" })
        .length(9, { message: "" }),
    accountant_number: z
        .string({ message: "" })
        .nonempty({ message: "" })
        .length(12, { message: "" }),
})
