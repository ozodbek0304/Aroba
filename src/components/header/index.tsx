import { useMode } from "@/hooks/useMode"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Spinner from "../ui/spinner"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { LogOut, User } from "lucide-react"
import Logo from "./logo"
import SearchInput from "./search-input"
import AddOrder from "./add-order"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { usePaths } from "@/hooks/usePaths"
import { useUser } from "@/constants/useUser"
import useCan from "@/hooks/useCan"

const Header = () => {
    const navigate = useNavigate()
    const pathname = useLocation().pathname

    const { childPaths } = usePaths()

    const handleLogOut = () => {
        navigate({ to: "/auth" })
        localStorage.removeItem("token")
        localStorage.clear()
        localStorage.removeItem("refresh")
    }

    const { info, isFetching } = useUser()

    const isSomeActive = (path: string) => {
        if (pathname?.split("/")?.length > 2) {
            return path?.slice(1) === pathname?.split("/")[1]
        } else {
            return false
        }
    }

    return (
        <header className="px-4 md:px-6 py-4 gap-4 flex items-center justify-between bg-card max-w-full box-border">
            <div className="flex items-center md:gap-8 min-w-14 max-w-full overflow-x-auto custom-scrollbar">
                <Link to="/" className="hidden xl:block">
                    <Logo />
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger className="!outline-none xl:hidden w-auto">
                        <Logo />
                    </DropdownMenuTrigger>
                    {childPaths?.length > 0 && (
                        <DropdownMenuContent>
                            {childPaths?.map((link) => (
                                <DropdownMenuItem
                                    key={link.label}
                                    onClick={() => navigate({ to: link.path })}
                                    className={`text-base text-muted-foreground p-2 font-medium flex items-center gap-2 cursor-pointer ${link.path === pathname && "!text-primary"} ${pathname.includes(link.path + "/") && "text-primary"}`}
                                >
                                    {link.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
                {childPaths.length > 0 && (
                    <Tabs
                        className="hidden md:flex overflow-x-auto custom-scrollbar max-w-full"
                        value={pathname}
                        onValueChange={(path) => navigate({ to: path })}
                    >
                        <TabsList>
                            {childPaths?.map((link) => (
                                <TabsTrigger
                                    key={link.label}
                                    value={link.path}
                                    className={`${pathname.includes(link.path + "/") && "!bg-primary !text-primary-foreground"} flex items-center gap-2 ${isSomeActive(link.path) && "!bg-primary/50"}`}
                                >
                                    {link.icon} {link.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                )}
            </div>
            <hgroup className="flex items-center gap-4">
                {useCan("orders/create-order/") && <AddOrder />}
                <SearchInput />
                <DropdownMenu>
                    <div className="relative h-10">
                        <DropdownMenuTrigger className="!outline-none">
                            <Avatar className="relative overflow-hidden">
                                {(!useMode() || isFetching) && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/80">
                                        <Spinner size="sm" />
                                    </div>
                                )}
                                <AvatarImage
                                    src={info?.photo}
                                    alt="user img"
                                    className="object-cover"
                                />
                                <AvatarFallback>
                                    {info?.first_name?.slice(0, 1)}
                                    {info?.last_name?.slice(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            asChild
                        >
                            <Link to="/profile">
                                <User width={16} />{" "}
                                {info?.first_name + " " + info?.last_name}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2 !text-red-500"
                            onClick={handleLogOut}
                        >
                            <LogOut width={16} /> Akkauntdan chiqish
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </hgroup>
        </header>
    )
}

export default Header
