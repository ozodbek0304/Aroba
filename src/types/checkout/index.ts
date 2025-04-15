type AllBalances = {
    agentlar_balansi: number
    main_balance: number
    umumiy_boshqa_harajatlar: number
    umumiy_reyslar_boyicha_harajatlar: number
}

type Transactions = {
    amount: string
    comment: string
    timestamp: string
    type: 1 | 2 | 3 | 4
}

type Agent = {
    balance: string
    defetsit: number
    first_name: string
    id: number
    last_name: string
}

type OtherDebts = { amount: string; comment: string; timestamp: string }

type CheckoutReyestr = {
    code: string
    company_code: number
    wanted_date: string
    departure_point: string
    destination: string
    truck_id: string
    trailer_id: string
    full_name: string
    phone_number: string
    cash?: number
    card?: number
    agent: string
    agent_name: string
}

type Receipt = {
    amount: string
    comment: string
    id: number
}

type AnotherDepts = {
    id: number
    amount: number
    comment: string
    check_url: string
    agent_full_name?: string
}

type Debters = {
    id: number
    full_name: string
    given_amount: string
    status: boolean
    user: number
    date: string
    amount: string
    comment: string
}

type CardData = {
    car_type: string
    code: string
    company_code: number
    departure_point: string
    destination: string
    full_name: string
    id: number
    phone_number: string
    trailer_id: string
    truck_id: string
    wanted_date: string
    card_number: string
    card_document: string
    card_owner_name: string
    prastoy: number
    card?: number
    cash?: number
}

type CashTransfers = {
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

type THistory = {
    agent: Agent
    cash: number
    code: string
    company_code: number
    departure_point: string
    destination: string
    full_name: string
    id: number
    phone_number: string
    trailer_id: string
    truck_id: string
    wanted_date: string
    prastoy: number
    reyestr_comment: string
    ttn_document_url: string
}

type AddingToDrivers = {
    id: number
    code: string
    route: string
    comment: string
    sender: { first_name: string; last_name: string }
    status: "waiting" | "approved" | "cancelled"
    amount: number
    file: string
    created_at: string
}

type DailyReport = {
    balance: number
    given_amount: number
    orders_amount: number
    other_amount: number
    return_amount: number
}

type DailyReportData = {
    agent_time: string
    cash: number
    company_code: number
    departure_point: string
    destination: string
    id: number
    phone_number: string
    trailer_id: string
    truck_id: string
    ttn_document_url: string
    wanted_date: string
}

type Factory = {
    codes: number[]
    place_name: string
    lon: string
    lat: string
    id?: number
    company_code: number
    same_uuid: string
    is_active?: boolean
}
