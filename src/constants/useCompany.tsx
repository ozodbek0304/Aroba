import { useGet } from "@/hooks/useGet"

export const useCompany = () => {
    const { data: firmsData } = useGet<Firm[]>("order/our-companies/")
    const firms = firmsData?.map((f) => ({
        inn: f.inn,
        label: f.name,
        value: f.id,
        paramValue: f.name,
    })) || []

    const { data: staffsWithFullNameOnlyData } = useGet<
        { id: number; full_name: string }[]
    >("user/users_full_name/")
    const staffsWithFullNameOnly = staffsWithFullNameOnlyData?.map((f) => ({
        label: f.full_name,
        value: f.id,
    })) || []

    return {
        firms: [{ label: "Hammasi", value: 1000, paramValue: undefined }, ...firms],
        staffsWithFullNameOnly,
    }
}
