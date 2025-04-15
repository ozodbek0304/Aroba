import { useGet } from "@/hooks/useGet"

export const useRoles = () => {
    const { data: rolesData } = useGet<{ name: string, id: number, actions: Module[] | number[] }[]>("users/roles/")
    const roles = rolesData?.map(r => ({ ...r, label: r.name, value: r.id }))

    return { roles }
}
