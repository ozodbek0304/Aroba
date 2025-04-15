export const statuses = [
    { label: "Hammasi", value: "all", paramValue: undefined },
    { label: "To'ldirilmoqda", value: "2", paramValue: "in_progress" },
    { label: "Start", value: "3", paramValue: "start" },
    { label: "Zavodda", value: "4", paramValue: "in_factory" },
    { label: "Yuklab chiqdi", value: "5", paramValue: "loaded" },
    { label: "Lokatsiya berildi", value: "6", paramValue: "has_location" },
    { label: "Finish", value: "9", paramValue: "finish" },
]

interface UseStatusesProps {
    all?: boolean
    start?: boolean
    finish?: boolean
    from?: string
}

export const useStatuses = (props?: UseStatusesProps) => {
    let filteredStatuses = [...statuses]

    if (props?.all === false)
        filteredStatuses = filteredStatuses.filter(
            (status) => status.value !== "all",
        )
    if (props?.start === false)
        filteredStatuses = filteredStatuses.filter(
            (status) => status.value !== "3",
        )
    if (props?.finish === false)
        filteredStatuses = filteredStatuses.filter(
            (status) => status.value !== "9",
        )

    if (props?.from) {
        const startIndex = filteredStatuses.findIndex(
            (status) => status.value === props.from,
        )
        filteredStatuses =
            startIndex !== -1 ? filteredStatuses.slice(startIndex + 1) : []
    }

    return filteredStatuses
}
