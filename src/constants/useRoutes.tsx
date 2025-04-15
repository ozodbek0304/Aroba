import { useGet } from "@/hooks/useGet"

export const useRoutes = (id: number | string) => {
    const { data: routesData } = useGet<Route[]>(
        "orders/create-order-routes/" + id + "/",
        {},
        { enabled: !!id },
    )
    const loadingRoutes = routesData?.map((f) => ({
        ...f,
        label: f.loading_name,
        value: f.loading_id,
    }))
    const unloadingRoutes = (id: number | string) => {
        return loadingRoutes
            ?.find((f) => f.loading_id == id)
            ?.unloadings?.map((u) => ({ ...u, label: u.name, value: u.id }))
    }
    return { loadingRoutes, unloadingRoutes }
}
