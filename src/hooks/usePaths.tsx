import { useLocation } from "@tanstack/react-router"
import { useMemo } from "react"
import {
    Calculator,
    Headset,
    PhoneCall,
    SlidersVertical,
    SquareUserRound,
} from "lucide-react"
import { ReactNode } from "react"
import { useUser } from "@/constants/useUser"

export interface MenuItem {
    label: string
    icon?: ReactNode
    path: string
    url?: string
    items?: MenuItem[]
}

export const usePaths = () => {
    const { perms, info } = useUser()
    const pathname = useLocation().pathname
    const modules = perms?.map((d) => d.url) || []

    const modulesSet = useMemo(() => new Set(modules), [modules]) || []

    const filterItems = (
        items: MenuItem[],
        modulesSet: Set<string>,
    ): MenuItem[] => {
        return info?.is_superuser ? items : (
                (items
                    .map((item) => {
                        if (item.items) {
                            const visibleSubItems = item.items.filter(
                                (subItem) => modulesSet.has(subItem.url || ""),
                            )

                            if (visibleSubItems.length > 0) {
                                return {
                                    ...item,
                                    items: visibleSubItems,
                                }
                            }
                            return null
                        }
                        return modulesSet.has(item.url || "") ? item : null
                    })
                    .filter(Boolean) as MenuItem[])
            )
    }

    const filteredItems = useMemo(
        () => filterItems(items, modulesSet),
        [modulesSet],
    )

    const headerLinks = useMemo(() => {
        return filteredItems
            .filter((f) => f.items || f)
            .map((f) => ({
                label: f.label,
                icon: f.icon,
                path: f.items?.[0]?.path || f.path,
            }))
    }, [filteredItems])

    const currentPathSegment = pathname.split("/")[1]

    const childPaths = useMemo(() => {
        return (
            filteredItems?.find(
                (f) =>
                    f.items?.some(
                        (s) =>
                            s.path?.slice(1) === currentPathSegment ||
                            s.url === currentPathSegment,
                    ) || f.path?.slice(1) === currentPathSegment,
            )?.items || []
        )
    }, [filteredItems, currentPathSegment])

    const allPaths = useMemo(() => {
        return (
            filteredItems
                .map((f) => (f.items ? f.items.map((i) => i.path) : [f.path]))
                .flat() || []
        )
    }, [filteredItems])
    return {
        headerLinks,
        childPaths,
        allPaths: [...allPaths, "/profile"],
        filteredItems,
    }
}

const items: MenuItem[] = [
    {
        label: "Dispetcher",
        icon: <Headset width={20} />,
        path: "/orders",
        items: [
            {
                label: "Buyurtmalar",
                path: "/orders",
                url: "dispatchers/new-orders/",
            },
            {
                label: "To'ldirish",
                path: "/fill-order",
                url: "dispatchers/filling-orders/",
            },
            {
                label: "Statusi",
                path: "/order-status",
                url: "managers/status-orders/",
            },
        ],
    },
    {
        label: "Menejer",
        icon: <SquareUserRound width={20} />,
        path: "/orderer",
        items: [
            {
                label: "Buyurtmachi",
                path: "/orderer",
                url: "clients/",
            },
            {
                label: "Hisobot",
                path: "/report",
                url: "checkout/report-orders/",
            },
            {
                label: "Kassa",
                path: "/checkout",
                url: "checkout/transactions/",
            },
        ],
    },
    {
        label: "Buxgalteriya",
        icon: <Calculator width={20} />,
        path: "/make-contract",
        items: [
            {
                label: "Shartnoma",
                path: "/contract",
                url: "accountant/clients/",
            },
            {
                label: "Faktura",
                path: "/faktura",
                url: "accountant/invoice-orders/",
            },
            {
                label: "Reyestr",
                path: "/reyestr",
                url: "accountant/finished-orders/",
            },
        ],
    },
    {
        label: "Kontaktlar",
        icon: <PhoneCall width={20} />,
        path: "/contacts",
        url: "imb/contacts/",
    },
    {
        label: "Admin",
        icon: <SlidersVertical width={20} />,
        path: "/control-users",
        items: [
            {
                label: "Foydalanuvchilar",
                path: "/control-users",
                url: "users/users/",
            },
            {
                label: "Rollar",
                path: "/roles",
                url: "users/roles/",
            },
        ],
    },
]
