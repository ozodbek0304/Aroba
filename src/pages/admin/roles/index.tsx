import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Check, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useColumns } from "./columns"
import { useGet } from "@/hooks/useGet"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "@/components/form/input"
import { useRequest } from "@/hooks/useRequest"
import { FormCheckbox } from "@/components/form/checkbox"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useRoles } from "@/constants/useRoles"
import { useConfirm } from "@/hooks/useConfirm"

const Roles = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const search: any = useSearch({ from: "/_main" })
    const { post, patch, remove, isPending } = useRequest()
    const confirm = useConfirm()
    const { roles } = useRoles()
    const { data: modules } =
        useGet<{ id: number; name: string; modules: Module[] }[]>(
            "users/sections/",
        )

    const role_info = roles?.find((r) => r.id == search.role)

    const allActions = modules?.flatMap((m) =>
        m.modules?.flatMap((f) => f.actions),
    )

    const form = useForm<z.infer<typeof roleSchema>>({
        resolver: zodResolver(roleSchema),
        disabled: isPending,
        values:
            search?.role === "new" ?
                {
                    name: "",
                    actions: allActions?.map((p) => ({
                        id: p.id,
                        isChecked: false,
                    })),
                }
            :   ({
                    name: role_info?.name,
                    actions: allActions?.map((p) => ({
                        id: p.id,
                        isChecked: !!role_info?.actions?.find((a) => a == p.id),
                    })),
                } as any),
    })

    async function onSubmit(data: z.infer<typeof roleSchema>) {
        const actions = data.actions
            ?.filter((a) => a.isChecked)
            .map((a) => a.id)
            .filter((id) => id !== undefined)

        const payload = {
            name: data?.name,
            actions,
        }

        if (search.role === "new") {
            await post("users/roles/", payload)
            queryClient.invalidateQueries({ queryKey: ["users/roles/"] })
            toast.success("Muvaffaqiyatli qo'shildi")
            navigate({ search: { role: undefined } as any })
            form.reset()
        } else {
            await patch("users/roles/" + search.role + "/", payload)
            queryClient.setQueryData(
                ["users/roles/"],
                (oldData: { name: string; id: number; actions: Module[] }[]) =>
                    oldData?.map((o) => {
                        if (o.id == search.role) {
                            return {
                                ...o,
                                name: data.name,
                                actions: allActions
                                    ?.filter((m) => actions?.includes(m.id))
                                    .map((f) => f.id),
                            }
                        } else {
                            return o
                        }
                    }),
            )
            form.reset()
        }
    }

    async function deleteRole() {
        const isConfirmed = await confirm({ title: "Sabab?" })
        if (isConfirmed) {
            await remove(`users/roles/${search.role}/`)
            toast.success("Muvaffaqiyatli o'chirildi")
            queryClient.setQueryData(
                ["users/roles/"],
                (oldData: { name: string; id: number; actions: Module[] }[]) =>
                    oldData?.filter((o) => o.id != search.role),
            )
            navigate({ search: { role: undefined } as any })
        }
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row items-start gap-4 w-full ">
                <div className="md:max-w-sm w-full space-y-4">
                    <Button
                        icon={<Plus width={18} />}
                        onClick={() => {
                            navigate({ search: { role: "new" } as any })
                            form.reset({ name: "", actions: [] })
                        }}
                    >
                        Rol
                    </Button>
                    <DataTable columns={useColumns()} data={roles} viewAll />
                </div>
                {!!search.role && (
                    <div className="flex flex-col gap-4 items-end w-full mt-14">
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="p-4 space-y-4 rounded-lg border border-border w-full relative overflow-hidden"
                        >
                            <div className="flex items-end justify-between">
                                <FormInput
                                    methods={form}
                                    name="name"
                                    label="Nomi"
                                    wrapperClassName="max-w-xs"
                                />
                                {!isNaN(search.role) && (
                                    <Button
                                        type="button"
                                        variant={"destructive"}
                                        icon={<Trash2 width={16} />}
                                        onClick={deleteRole}
                                    >
                                        Rolni o'chirish
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-8">
                                {modules?.map((m) => (
                                    <div key={m.id}>
                                        <h2 className="font-medium text-xl pb-3">
                                            {m.name}
                                        </h2>
                                        <div className="space-y-3 md:space-y-2">
                                            {m.modules?.map((m2) => (
                                                <div
                                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-10 gap-y-1"
                                                    key={m2.id}
                                                >
                                                    <h4 className="text-muted-foreground">
                                                        {m2.name}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        {allActions
                                                            ?.filter((f) =>
                                                                m2.actions?.find(
                                                                    (a) =>
                                                                        a.id ==
                                                                        f.id,
                                                                ),
                                                            )
                                                            ?.map((p, i) => (
                                                                <FormCheckbox
                                                                    key={i}
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name={`actions.${allActions?.findIndex((a) => a.id == p.id)}.isChecked`}
                                                                    label={
                                                                        p.name
                                                                    }
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="submit"
                                icon={<Check width={16} />}
                                loading={isPending}
                            >
                                Saqlash
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Roles

const roleSchema = z.object({
    name: z.string({ message: "" }).min(1, "Nomini kiriting"),
    actions: z
        .array(
            z.object({
                id: z.number().optional(),
                name: z.string().optional(),
                isChecked: z.boolean().optional(),
            }),
        )
        .optional()
        .nullable(),
})
