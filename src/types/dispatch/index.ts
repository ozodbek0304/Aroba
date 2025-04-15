type DispatchData = {
    id: number
    mine?: boolean
    company_code: number
    departure_point: string
    destination: string
    code: string
    comment: string
    dispatcher?: {
        first_name: string
        last_name: string
        id: number
    } | null
    created_at: string
    now: string
    get_time: string
    wanted_date: string
    rejected_comment?: string
    payment_type?: { id: number; name: string }
    payment_types: { id: number; name: string }[]
    region_id: number
    region_id_2: number
}

type DispatchsState = {
    dispatchs: DispatchData[]
    mineDispatchs: DispatchData[]
    status: "idle" | "loading" | "succeeded" | "failed"
    loading: boolean
    error: string | null
    tableView: boolean
    pagination: {
        page: number
        limit: number
        total: number
        prev: boolean
        next: boolean
    }
}

type Route = {
    loading_name: string
    loading_id: number
    unloadings: { name: string; id: number }[]
}
