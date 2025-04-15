import { Download } from "lucide-react"
import { Button } from "./ui/button"
import { useDownloadAsExcel } from "@/hooks/useDownloadAsExcel"

const DownloadAsExcel = ({ url, name }: { url: string, name: string }) => {
    const { trigger, isFetching } = useDownloadAsExcel({ url, name })
    return (
        <Button variant='secondary' icon={<Download width={16} />} loading={isFetching} onClick={trigger}>Yuklab olish</Button>
    )
}

export default DownloadAsExcel