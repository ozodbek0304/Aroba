type Order = {
    id: number
    code: string
    comment: string
    client: string
    created_at: string
    date: string
    dispatcher: { id: number; first_name: string; last_name: string } | null
    loading: string
    unloading: string
    payment_type: "cash" | "transfer"
}

type OrderData = {
    results: Order[]
    count: number
}

type Place = {
    name: string
    id: number
    company_code: number
    long: string
    lat: string
    viloyat: string
    status: number
}

type Region = { name: string; id: number }
type Car = { id: number; option_name: string; type: string }
type IPlace = {
    label: string
    value: string | number
    id: number
    company_code?: number
    status?: number
    long?: string
    lat?: string
    viloyat?: string
}

type FillingOrder = {
    id: number
    car_number: string | null
    client: { name: string; id: number }
    code: string
    comment: string
    created_at: string
    date: string
    driver_phone: string | null
    extra_amount: { amount: number; comment: string; file: string }
    loading: { name: string; id: number }
    unloading: { name: string; id: number }
    payment_type: "cash" | "transfer"
    total_amount: number
    status:number
    dispatcher: { id: number; first_name: string; last_name: string }
}

type Analyze = {
    car_model: string
    car_type: string
    card: number
    cash: number
    code: string
    comment: string
    company_code: number
    contract: string | null
    contract_date: string | null
    created_at: string
    departure_point: string
    destination: string
    dispatcher: number
    driver_jsh: number
    full_name: string
    id: number
    payment_type: string
    phone_number: string
    score: number | null
    shipper_inn: number
    shipper_name: string
    status: string
    summa_perechisleniya: number
    trailer_id: string
    trailer_type: string
    truck_id: string
    wanted_date: string
    waybill: string | null
}

type Status = {
    car_number: null | string
    client: { name: string; id: number }
    code: string
    date: string
    driver_phone: null | string
    id: number
    loading: { name: string; id: number }
    unloading: { name: string; id: number; lon: string; lat: string }
    status: number
}

type ReyestsOrder = {
    car_type: string
    code: string
    company_code: number
    departure_point: string
    destination: string
    distributor: string | null
    id: number
    note1: string | null
    note2: string | null
    order_type: "order" | "archive"
    status: string
    truck_id: string
    ttn: string | null
    wanted_date: string
}

type TDistributor = {
    id: number
    name: string
    distributor_codes: number[]
}

type OrderPlastic = {
    id: number
    code: string
    company_code: number
    wanted_date: string
    departure_point: string
    destination: string
    truck_id: string
    card: number
    phone_number: string
    by_card: number
    reyestr_comment: string
}

type OrderCash = {
    id: number
    code: string
    wanted_date: string
    departure_point: string
    destination: string
    agent_status: number
    truck_id: string
    trailer_id: string
    full_name: string
    cash: number
    phone_number: string
    company_code: number
    prastoy: number
    reyestr_comment: string
}

type OrderFactoryPay = {
    id: number
    code: string
    wanted_date: string
    departure_point: string
    destination: string
    agent_status: number
    truck_id: string
    trailer_id: string
    full_name: string
    cash: number
    phone_number: string
    company_code: number
    ttn_document_url: string | null
}
