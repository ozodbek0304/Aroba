import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/profile")({
    component: Profile,
})

import { FormFormatNumberInput } from "@/components/form/format-number-input"
import { FormNumberInput } from "@/components/form/number-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/constants/useUser"
import { useRequest } from "@/hooks/useRequest"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

function Profile() {
    const { patch, isPending } = useRequest()
    const { info } = useUser()

    const form = useForm<z.infer<typeof Form>>({
        values: {
            chat_id: info?.chat_id?.toString() || "",
            phone: info?.phone || "",
        },
        disabled: isPending,
    })

    async function onSubmit(data: z.infer<typeof Form>) {
        await patch(`auth/users/${info?.id}/`, data)
        toast.success("Muvaffaqiyatli o'zgartirildi")
    }
    return (
        <main className="space-y-6 w-full sm:max-w-[500px]">
            <Avatar className="w-52 h-52 rounded-lg">
                <AvatarImage
                    src={
                        import.meta.env.VITE_DEFAULT_URL +
                            info?.photo?.slice(1) || ""
                    }
                    className="object-cover"
                />
                <AvatarFallback className="text-3xl font-semibold rounded-lg bg-white">
                    {info?.first_name?.slice(0, 1)}
                    {info?.last_name?.slice(0, 1)}
                </AvatarFallback>
            </Avatar>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <FormNumberInput
                    control={form.control}
                    label="Telegram id"
                    name="chat_id"
                />
                <FormFormatNumberInput
                    control={form.control}
                    label="Telefon raqam"
                    name="phone"
                    format="+### ## ### ## ##"
                />
                <Button type="submit" loading={isPending}>
                    O'zgartirish
                </Button>
            </form>
        </main>
    )
}

const Form = z.object({
    chat_id: z.string().min(5, ""),
    phone: z.string().length(9, ""),
})
