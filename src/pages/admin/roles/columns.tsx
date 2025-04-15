import { ColumnDef } from "@tanstack/react-table"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const useColumns = (): ColumnDef<any>[] => {
    const navigate = useNavigate()
    return [
        {
            header: "Nomi",
            accessorKey: "name",
        },
        {
            header: " ",
            cell: ({ row }) => {
                return (
                    <Button
                        icon={<ArrowRight width={18} />}
                        className="!text-primary w-full"
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate({ search: { role: row.original.id } as any })}
                    />
                )
            },
        },
    ]
}