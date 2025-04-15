import { useGet } from "@/hooks/useGet"
import { useMemo } from "react"

export interface CodeOption {
    label: number
    value: number
}

export const useCodes = () => {
    const { data: codesData, error, isLoading } = useGet<{ code: number[] }>(
        "order/company_codes/"
    )

    const codes = useMemo(() => {
        if (!codesData?.code) return []

        return codesData.code
            .sort((a, b) => a - b)
            .map((f) => ({ label: f, value: f }))
    }, [codesData?.code])

    if (isLoading) return { codes: [], loading: true }
    if (error) return { codes: [], error }

    return { codes }
}
