import { useSearch } from "@tanstack/react-router"
import { useState, useEffect, useMemo } from "react"

const useFilter = <T extends Record<string, any>>(data: T[] | undefined) => {
    const [filteredData, setFilteredData] = useState<T[]>(data || [])
    const params: any = useSearch({ from: "/_main" })

    const filtered = useMemo(() => {
        if (!data?.length || !params?.search_term) {
            return data || []
        }

        const lowercasedQuery =
            typeof params.search_term !== "number" ?
                params?.search_term?.toLowerCase()
            :   params.search_term
        const keys = Object.keys(data[0])

        return data.filter((item) =>
            keys.some((key) =>
                item[key]?.toString().toLowerCase().includes(lowercasedQuery),
            ),
        )
    }, [data, params?.search_term])

    useEffect(() => {
        setFilteredData(filtered)
    }, [filtered])

    return (filteredData || []) as T[]
}

export default useFilter
