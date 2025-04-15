import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRequest } from "@/hooks/useRequest"
import { useQueryClient } from "@tanstack/react-query"
import { FormInput } from "@/components/form/input"
import { FormImagePicker } from "@/components/form/img-picker"
import { FormFormatNumberInput } from "@/components/form/format-number-input"
import { FormMultiCombobox } from "@/components/form/multi-combobox"
import { useEffect } from "react"
import { useRoles } from "@/constants/useRoles"
import { toast } from "sonner"

export default function ControlUser({ open, setOpen, current }: thisProps) {
    const queryClient = useQueryClient()
    const { post, patch, isPending } = useRequest(
        {
            onSuccess: (res) => {
                queryClient.setQueryData(
                    ["users/users/"],
                    (oldData: AddUser[]) =>
                        current?.id ?
                            oldData?.map((o) => (o.id == current?.id ? res : o))
                        :   [...oldData, res],
                )
            },
        },
        { contentType: "multipart/form-data" },
    )

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        disabled: isPending,
        values: current,
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (current?.id) {
            await patch(`users/users/${current?.id}/`, {
                ...data,
                photo:
                    typeof data?.photo === "string" ? undefined : data?.photo,
                password: undefined,
            })
            setOpen(false)
            form.reset()
            toast.success("Muvaffaqiyatli tahrirlandi")
        } else {
            if (data.password) {
                await post("users/users/", data)
                setOpen(false)
                form.reset()
                toast.success("Muvaffaqiyatli qo'shildi")
            } else {
                toast.error("Parol kiritilmadi")
            }
        }
    }

    useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [open, form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md pb-6">
                <DialogHeader>
                    <DialogTitle className="text-left">
                        {current?.id ?
                            "Foydalanuvchi tahrirlash"
                        :   "Foydalanuvchi qo'shish"}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormImagePicker
                            control={form.control}
                            name="photo"
                            label="Rasm"
                            className="scale-[2] mb-6 mt-2"
                        />
                        <FormInput
                            methods={form}
                            name="first_name"
                            label="Ismi"
                        />
                        <FormInput
                            methods={form}
                            name="last_name"
                            label="Familiyasi"
                        />
                        <FormFormatNumberInput
                            control={form.control}
                            name="phone"
                            label="Telefon raqam"
                            format="+###  ##  ###  ##  ##"
                        />
                        <FormMultiCombobox
                            control={form.control}
                            name="roles"
                            label="Rol"
                            options={useRoles().roles}
                            returnVal="value"
                        />
                        <FormInput
                            methods={form}
                            name="username"
                            label="Login"
                        />
                        <FormInput
                            methods={form}
                            name="password"
                            label="Parol"
                            type="password"
                        />
                        <Button
                            icon={<Plus width={18} />}
                            type="submit"
                            loading={isPending}
                        >
                            {current?.id ? "Tahrirlash" : "Qo'shish"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const FormSchema = z.object({
    photo: z.instanceof(File).or(z.string()),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    phone: z.string().length(12),
    roles: z.array(z.number().or(z.string())),
    username: z.string().min(1),
    password: z.string().optional(),
})

interface thisProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    current: any
}
