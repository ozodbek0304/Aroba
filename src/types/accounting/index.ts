type Firm = {
    id: number
    name: string
    inn: string
}

type MakeContractData = {
    id: 1
    accounting_phone: string
    customer: string
    inn: null | number
    name: string
    phone: string
    requisite: string
    requisite_file: string | null
}

type FakturaData = {
    id: number
    load_name: string
    wanted_date: string
    departure_point: string
    destination: string
    truck_id: string
    shipper_name: string
    shipper_inn: number
    summa_perechisleniya: string
    caller: {
        first_name: string
        last_name: string
    }
    contract: string
    contract_date: string
    accountant_number: string
    mine: boolean
    transporter: string
    connection_status: string | null
    reject_comment?: string
}

type TransferFinish = {
    id: number
    departure_point: string
    destination: string
    load_name: string
    shipper_inn: number
    shipper_name: string
    summa_perechisleniya: string
    transporter: string
    truck_id: string
    wanted_date: string
}

type TransferStatus = {
    id: number
    transporter: string
    wanted_date: string
    departure_point: string
    destination: string
    truck_id: string
    shipper_name: string
    shipper_inn: number
    summa_perechisleniya: number
    images_link: string | null
    status: 1 | 2 | 3 | 4
}

type Reyestr = {
    client_name: string
    date: string
    loading: string
    unloading: string
    car_number: string
    income: number
    phone: string
}
