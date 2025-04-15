import { Button } from "@/components/ui/button"
import SeeInView from "@/components/ui/see-in-view"
import useCan from "@/hooks/useCan"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import { ColumnDef } from "@tanstack/react-table"
import { Check, } from "lucide-react"
export const useColumns = ({
    handleForm,
}: {
    handleForm: (d: MakeContractData) => void
}): ColumnDef<MakeContractData>[] => {
    const canAccept = useCan('accountant/clients/$/')
    return (
        ([
            {
                header: "№",
                cell: ({ row }) => row.index + 1,
            },
            {
                header: "Buyurtmachi",
                cell: ({ row }) => (
                    <div className="flex flex-col text-sm">
                        <span>{row.original?.name}</span>
                        <span className="text-muted-foreground">{formatPhoneNumber(row.original?.phone)}</span>
                    </div>
                ),
            },
            {
                header: "Buxgalter raqami",
                cell: ({ row }) => (
                    <a
                        href={`tel:${row.original?.accounting_phone}`}
                        className="flex items-center gap-2"
                    >
                        {formatPhoneNumber(row.original?.accounting_phone)}
                    </a>
                ),
            },
            {
                header: "Rekvizit",
                cell: ({ row }) => row.original?.requisite ? row.original?.requisite : <SeeInView url={row.original?.requisite_file || ''} className="w-8 h-8 rounded object-cover" />
            },
            {
                header: "Amallar",
                cell: ({ row }) => !row.original?.inn && <Button
                    icon={<Check width={16} />}
                    variant="ghost"
                    className="!text-green-500"
                    size='sm'
                    onClick={() => handleForm(row.original)} />
            },
        ] as ColumnDef<MakeContractData>[])?.slice(0, canAccept ? 7 : 6)
    )
}
