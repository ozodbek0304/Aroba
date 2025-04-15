import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { FormInput } from "@/components/form/input"
import { useState } from "react"
import axios from "axios"

export const Route = createLazyFileRoute("/_auth/auth")({
    component: AuthComponent,
})

function AuthComponent() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setLoading(true)
            const { data: res, status } = await axios.post(
                import.meta.env.VITE_DEFAULT_URL + "auth/login/",
                data,
            )
            if (status === 200) {
                localStorage.setItem("token", res.access)
                localStorage.setItem("refresh", res.refresh)
                navigate({ to: "/" })
            }
        } catch (error: any) {
            toast.error(error.response.data.detail || "Bunday user mavjud emas")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-2xl text-center">
                        Kirish
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" space-y-4"
                    >
                        <FormInput
                            name="username"
                            label="Login"
                            methods={form}
                            disabled={loading}
                        />
                        <FormInput
                            name="password"
                            label="Parol"
                            type="password"
                            methods={form}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full"
                        >
                            Kirish
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

const FormSchema = z.object({
    username: z.string().min(1, "Loginingizni kiriting"),
    password: z.string().min(1, "Parolingizini kiriting"),
})
