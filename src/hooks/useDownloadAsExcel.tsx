import http from "@/lib/http"
import { useState } from "react"

export const useDownloadAsExcel = ({
    url,
    name,
}: {
    url: string
    name?: string
}) => {
    const [isFetching, setIsFetching] = useState(false)

    const trigger = async () => {
        setIsFetching(true)
        try {
            const response = await http.get(url, { responseType: "blob" })
            if (response.status === 200) {
                downloadAsExcel({ data: response.data, name })
            }
        } catch (error) {
            console.error("Error downloading file:", error)
        } finally {
            setIsFetching(false)
        }
    }

    return { trigger, isFetching }
}

type Arg = {
    data: Blob
    name?: string
}

function downloadAsExcel({ data, name = new Date().toISOString() }: Arg) {
    const blob = new Blob([data])
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = name + ".xlsx"
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
}
