import ParamTabs from "@/components/as-params/tabs"
import { CollapsibleDataTable } from "@/components/collapsible-table"
import { useSearch } from "@tanstack/react-router"
import Reyestr from "./reyestr"
import { useColumns, useColumns2 } from "./columns"
import { useGet } from "@/hooks/useGet"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useConfirm } from "@/hooks/useConfirm"
import http from "@/lib/http"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { usePaths } from "@/hooks/usePaths"

const Report = () => {
    const search: any = useSearch({ from: "/_main" })
    const confirm = useConfirm()
    const queryClient = useQueryClient()

    const { data, isLoading } = useGet<{ results: any[]; total_pages: number }>(
        `checkout/report-orders/`,
        { ...search, payment_type: "cash" },
        {
            enabled: search.payment_type !== "reyestr",
            refetchOnMount: true,
            refetchOnWindowFocus: true,
        },
    )
    const { data: data2, isLoading: isLoading2 } = useGet<{
        results: any[]
        total_pages: number
    }>(
        `checkout/report-orders/`,
        { ...search, payment_type: "transfer" },
        {
            enabled: search.payment_type !== "reyestr",
            refetchOnMount: true,
            refetchOnWindowFocus: true,
        },
    )

    async function handlePay(id: number, type: "qarz" | "chiqim") {
        const isConfirmed = await confirm({ title: "Tasdiqlansinmi?" })
        if (isConfirmed) {
            toast.promise(
                http
                    .get(
                        type === "qarz" ?
                            `checkout/pay-client-order/${id}/`
                        :   `checkout/pay-order/${id}/`,
                    )
                    .then(() => {
                        queryClient.invalidateQueries({
                            queryKey: ["checkout/balance-info/"],
                        })
                    }),
                {
                    loading: "Tasdiqlanmoqda",
                    success: () => {
                        queryClient.invalidateQueries({
                            queryKey: [`checkout/report-orders/`, search],
                        })
                        return "Muvaffaqiyatli tasdiqlandi"
                    },
                },
            )
        }
    }

    const canReyestr = !!usePaths().allPaths.includes("checkout/summary/")

    return (
        <div className="space-y-4">
            <Tabs value={search.payment_type || "cash"}>
                <TabsContent value="cash">
                    <CollapsibleDataTable
                        loading={isLoading}
                        columns={useColumns({ handlePay })}
                        data={data?.results
                            ?.filter((f) => f?.to_orders?.length > 0)
                            ?.map((item) => ({
                                ...item,
                                subRows: item?.to_orders || [],
                            }))}
                        paginationProps={{ totalPages: data?.total_pages }}
                        head={
                            <div className="!flex-col !items-start">
                                <ParamTabs
                                    paramName="payment_type"
                                    options={[
                                        {
                                            label: "Naqd",
                                            value: "cash",
                                        },
                                        {
                                            label: "Pul o'tkazish",
                                            value: "transfer",
                                        },
                                        {
                                            label: "Reyestr",
                                            value: "reyestr",
                                        },
                                    ]?.slice(0, canReyestr ? 3 : 2)}
                                />
                            </div>
                        }
                    />
                </TabsContent>
                <TabsContent value="transfer">
                    <CollapsibleDataTable
                        loading={isLoading2}
                        columns={useColumns2({ handlePay })}
                        data={data2?.results
                            ?.filter((f) => f.to_orders.length > 0)
                            ?.map((item) => ({
                                ...item,
                                subRows: item.to_orders,
                            }))}
                        paginationProps={{ totalPages: data2?.total_pages }}
                        head={
                            <div className="!flex-col !items-start">
                                <ParamTabs
                                    paramName="payment_type"
                                    options={[
                                        {
                                            label: "Naqd",
                                            value: "cash",
                                        },
                                        {
                                            label: "Pul o'tkazish",
                                            value: "transfer",
                                        },
                                        {
                                            label: "Reyestr",
                                            value: "reyestr",
                                        },
                                    ]?.slice(0, canReyestr ? 3 : 2)}
                                />
                            </div>
                        }
                    />
                </TabsContent>
                <TabsContent value="reyestr">
                    <Reyestr />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Report
