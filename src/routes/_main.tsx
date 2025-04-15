import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Spinner from "@/components/ui/spinner"
import {
    createFileRoute,
    Outlet,
    useLocation,
    useNavigate,
} from "@tanstack/react-router"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useUser } from "@/constants/useUser"
import { useEffect } from "react"
import { usePaths } from "@/hooks/usePaths"

export const Route = createFileRoute("/_main")({
    component: MainLayout,
})

function MainLayout() {
    const pathname = useLocation().pathname
    const navigate = useNavigate()
    const { isFetching } = useUser()
    const { allPaths } = usePaths()

    useEffect(() => {
        if (allPaths?.length > 0 && !allPaths.includes(pathname)) {
            navigate({ to: "/" })
        }
    }, [allPaths, pathname])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate({ to: "/auth" })
        }
    }, [pathname])

    return (
        <>
            <div className="fixed top-0 w-full bg-background z-50">
                <Header />
            </div>
            <main className="flex xl:gap-2 px-4 md:px-6 md:pl-4 pt-4 md:pt-6 mt-[72px] relative">
                <Sidebar />
                <div
                    className="w-full pb-2 sm:pb-4 xl:pl-[88px]"
                    suppressHydrationWarning
                >
                    <Outlet />
                </div>
                <AlertDialog open={isFetching}>
                    <AlertDialogContent className="w-max !bg-transparent border-none shadow-none p-0">
                        <VisuallyHidden>
                            <AlertDialogTitle>Yuklanmoqda...</AlertDialogTitle>
                            <AlertDialogDescription>
                                Yuklanmoqda...
                            </AlertDialogDescription>
                        </VisuallyHidden>
                        <Spinner color="secondary" size="responsive" />
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </>
    )
}

export default MainLayout
