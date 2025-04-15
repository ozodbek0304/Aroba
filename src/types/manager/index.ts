type Client = {
    id: number
    accounting_phone: string
    phone: string
    name: string
    requisite: string
    requisite_file: string
    routes?: {
        id: number
        amount: number
        loading: { name: string; id: number }
        unloading: { name: string; id: number }
    }[]
}

type ClientRoute = {
    id: number
    amount: string
    loading: { name: string; id: number }
    unloading: { name: string; id: number }
}
type Send = {
    id: number
    accounting_phone: string
    inn: number | null
    name: string
    invoices?: {
        created_at: string
        id: number
        status: string | null
        to_orders: {
            car_number: string
            code: string
            id: number
            loading_name: string
            total_amount: string
            unloading_name: string
        }[]
    }[]
}
