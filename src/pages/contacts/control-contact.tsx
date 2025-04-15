import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Edit2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRequest } from "@/hooks/useRequest"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { FormInput } from "@/components/form/input"
import { FormFormatNumberInput } from "@/components/form/format-number-input"
import { useEffect } from "react"
import FileUpload2 from "@/components/form/file-upload2"
import { FormCarNumber } from "@/components/form/car-number"
import { useSearch } from "@tanstack/react-router"

interface thisProps {
    open: boolean
    setOpen: (val: boolean) => void
    current?: Contact
}
export default function AddContact({ open, setOpen, current }: thisProps) {
    const queryClient = useQueryClient()
    const search: any = useSearch({ from: "/_main" })
    const { post, patch, isPending } = useRequest(
        {
            onSuccess: (data) => {
                if (current?.id) {
                    queryClient.setQueryData(
                        ["imb/contacts/", {}],
                        (oldData: { results: Contact[]; count: number }) => ({
                            ...oldData,
                            results: oldData?.results?.map((item) =>
                                item.id === current.id ? data : item,
                            ),
                        }),
                    )
                } else {
                    queryClient.setQueryData(
                        ["imb/contacts/", {}],
                        (oldData: { results: Contact[]; count: number }) => ({
                            ...oldData,
                            results: [...oldData.results, data],
                        }),
                    )
                }
            },
        },
        { contentType: "multipart/form-data" },
    )

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        values:
            current?.full_name ?
                ({
                    full_name: current?.full_name,
                    phone: "998" + current?.phone,
                    truck_id: current?.truck_id,
                } as any)
            :   undefined,
        disabled: isPending,
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (current?.full_name) {
            await patch("imb/contacts/" + current.id + "/", {
                ...data,
                phone: data?.phone.slice(3)?.split(" ").join(""),
            })
            toast.success("Muvaffaqiyatli tahrirlandi")
            setOpen(false)
            form.reset()
        } else {
            if (
                data.license_front ||
                data.license_back ||
                data.track_front ||
                data.track_back ||
                data.trailer_front ||
                data.trailer_back
            ) {
                await post("imb/contacts/", {
                    ...data,
                    phone: data?.phone.slice(3)?.split(" ").join(""),
                })
                toast.success("Muvaffaqiyatli qo'shildi")
                setOpen(false)
                form.reset()
            } else {
                toast.error("Hamma rasmlarni kiriting")
            }
        }

        queryClient.invalidateQueries({
            queryKey: ["imb/contacts/", { ...search, tab: undefined }],
        })
    }

    useEffect(() => {
        if (!open) {
            form.reset()
        } else if (!current?.full_name) {
            form.reset({
                full_name: "",
                phone: "",
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-3xl pb-6">
                <DialogHeader>
                    <DialogTitle className="text-left">
                        Yangi kontakt
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormInput
                                methods={form}
                                name="full_name"
                                label="To'liq ismi"
                            />
                            <FormFormatNumberInput
                                control={form.control}
                                name="phone"
                                label="Telefon raqami"
                                format="+### ## ### ## ##"
                            />
                            <FormCarNumber
                                control={form.control}
                                name="truck_id"
                                label="Avtomobil raqami"
                            />
                            <div />
                            <FileUpload2
                                control={form.control}
                                name="track_front"
                                label="Tirgach (oldi)"
                            />
                            <FileUpload2
                                control={form.control}
                                name="trailer_front"
                                label="Pritsep (oldi)"
                            />
                            <FileUpload2
                                control={form.control}
                                name="track_back"
                                label="Tirgach (orqa)"
                            />
                            <FileUpload2
                                control={form.control}
                                name="trailer_back"
                                label="Pritsept (orqa)"
                            />
                            <FileUpload2
                                control={form.control}
                                name="license_front"
                                label="Prava (oldi)"
                            />
                            <FileUpload2
                                control={form.control}
                                name="license_back"
                                label="Parava (orqa)"
                            />
                        </div>
                        <Button
                            icon={
                                current?.full_name ?
                                    <Edit2 width={18} />
                                :   <Plus width={18} />
                            }
                            type="submit"
                            loading={isPending}
                            className="w-max ml-auto"
                        >
                            {current?.full_name ? "Tahrirlash" : "Qo'shish"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const FormSchema = z.object({
    full_name: z.string({ message: "" }).min(1, "To'liq ismini kiriting"),
    phone: z.string({ message: "" }).length(12),
    truck_id: z.string({ message: "" }).min(5, { message: "" }),
    track_front: z.any({ message: "" }),
    track_back: z.any({ message: "" }),
    trailer_front: z.any({ message: "" }),
    trailer_back: z.any({ message: "" }),
    license_front: z.any({ message: "" }),
    license_back: z.any({ message: "" }),
})
