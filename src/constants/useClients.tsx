import { useGet } from "@/hooks/useGet"
import { useMemo } from "react"

export interface Client {
    id: number
    name: string
    label: string
    value: number
    type: 'cash' | 'transfer'
}

export const useClients = () => {
    const { data: clientsData, error, isLoading } = useGet<{ id: number; name: string }[]>(
        "orders/clients/"
    )

    const clients = useMemo(() => {
        if (!clientsData) return []

        return clientsData.map((client) => ({
            ...client,
            label: client.name,
            value: client.id,
        }))
    }, [clientsData])

    if (isLoading) return { clients: [], loading: true }
    if (error) return { clients: [], error }

    return { clients: clients as Client[] }
}
