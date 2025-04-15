import { Button } from "@/components/ui/button"
import SeeInView from "@/components/ui/see-in-view"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import { Link, useSearch } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Plus } from "lucide-react"

export const useColumns = ({
    onAdd,
    onEdit,
}: {
    onAdd: () => void
    onEdit: (val: ClientRoute) => void
}): ColumnDef<Client>[] => {
    const search: any = useSearch({ from: "/_main" })
    return [
        {
            header: "№",
            cell: ({ row }) => (row.original.name ? row.index + 1 : ""),
        },
        {
            header: "Buyurtmachi",
            cell: ({ row }) =>
                row.original?.id ?
                    <div className="flex flex-col text-sm">
                        <span>{row.original.name}</span>
                        <span className="text-muted-foreground">
                            {formatPhoneNumber(row.original.phone)}
                        </span>
                    </div>
                :   "",
        },
        {
            header: "Qayerdan",
            accessorKey: "loading.name",
            cell: (info) => info.renderValue(),
        },
        {
            header: "Qayerga",
            accessorKey: "unloading.name",
            cell: (info) => info.renderValue(),
        },
        {
            header: "Summa",
            accessorKey: "amount",
            cell: (info) =>
                info.getValue() && formatMoney(`${info.getValue()}`),
        },
        {
            header: "Amallar",
            cell: ({ row }) => (
                <Link search={{ ...search, client: row.original.id } as any}>
                    {row.original.name ?
                        <Button
                            icon={<Plus width={18} />}
                            size="sm"
                            variant="ghost"
                            className="!text-green-500"
                            onClick={() => {
                                row.toggleExpanded()
                                onAdd()
                            }}
                        />
                    :   <Button
                            icon={<Edit width={18} />}
                            size="sm"
                            variant="ghost"
                            className="!text-primary"
                            onClick={() => onEdit(row.original as any)}
                        />
                    }
                </Link>
            ),
        },
    ]
}

export const useColumns2 = ({
    onAdd,
    onEdit,
}: {
    onAdd: () => void
    onEdit: (val: ClientRoute) => void
}): ColumnDef<Client>[] => {
    const search: any = useSearch({ from: "/_main" })
    return [
        {
            header: "№",
            cell: ({ row }) => (row.original.name ? row.index + 1 : ""),
        },
        {
            header: "Buyurtmachi",
            cell: ({ row }) =>
                row.original?.name ?
                    <div className="flex flex-col text-sm">
                        <span>{row.original.name}</span>
                        <span className="text-muted-foreground">
                            {formatPhoneNumber(row.original.phone)}
                        </span>
                    </div>
                :   "",
        },
        {
            header: "Rekvizit",
            cell: ({ row }) =>
                row.original.requisite ?
                    row.original.requisite
                :   row.original?.name && (
                        <SeeInView
                            url={row.original.requisite_file}
                            className="w-8 h-8 rounded object-cover"
                        />
                    ),
        },
        {
            header: "Tashuvchi",
            accessorKey: "customer",
        },
        {
            header: "INN",
            accessorKey: "inn",
        },
        {
            header: "Buxgalter raqami",
            cell: ({ row }) => (
                <a
                    href={`tel:${row.original.accounting_phone}`}
                    className="flex items-center gap-2 w-max"
                >
                    {formatPhoneNumber(row.original.accounting_phone)}
                </a>
            ),
        },
        {
            header: "Qayerdan",
            accessorKey: "loading.name",
            cell: (info) => info.renderValue(),
        },
        {
            header: "Qayerga",
            accessorKey: "unloading.name",
            cell: (info) => info.renderValue(),
        },
        {
            header: "Summa",
            accessorKey: "amount",
            cell: (info) =>
                info.getValue() && formatMoney(`${info.getValue()}`),
        },
        {
            header: "Amallar",
            cell: ({ row }) => (
                <Link search={{ ...search, client: row.original.id } as any}>
                    {row.original.name ?
                        <Button
                            icon={<Plus width={18} />}
                            size="sm"
                            variant="ghost"
                            className="!text-green-500"
                            onClick={() => {
                                row.toggleExpanded()
                                onAdd()
                            }}
                        />
                    :   <Button
                            icon={<Edit width={18} />}
                            size="sm"
                            variant="ghost"
                            className="!text-primary"
                            onClick={() => onEdit(row.original as any)}
                        />
                    }
                </Link>
            ),
        },
    ]
}
