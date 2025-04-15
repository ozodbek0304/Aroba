import { useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import { usePaths } from "@/hooks/usePaths"
import { cn } from "@/lib/utils"
import Draggable from "react-draggable"
import { Link, useLocation } from "@tanstack/react-router"

const Sidebar = () => {
    const [drawer, setDrawer] = useState(false)
    const location = useLocation()
    const pathname = location.pathname

    const nodeRef = useRef(null)

    const { headerLinks, childPaths } = usePaths()

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === path
        } else {
            return (
                childPaths.find(
                    (f) =>
                        f.path === path &&
                        (pathname !== path || !pathname.includes(path)),
                ) || pathname.includes(path)
            )
        }
    }

    return (
        <aside
            className={`z-50 h-full min-h-[calc(100dvh-80px)] -left-16 xl:left-4 top-16 -ml-4 transition-all duration-300 fixed px-[15px] shadow-header dark:shadow-card py-2 sm:py-3 flex-col flex bg-card w-full sm:w-auto ${
                drawer ? "!w-60 !left-4" : "!w-20"
            }`}
        >
            <ChevronRight
                className={cn(
                    "hidden xl:block w-6 bg-primary text-primary-foreground rounded-full p-1 absolute top-8 right-0 translate-x-full sm:translate-x-1/2 aspect-square cursor-pointer duration-300",
                    { "rotate-180": drawer },
                )}
                onClick={() => setDrawer(!drawer)}
            />
            <Draggable
                nodeRef={nodeRef}
                axis="y"
                defaultPosition={{ y: 300, x: 0 }}
                defaultClassName="absolute -right-[26px] block xl:hidden"
                onStart={() => setDrawer(!drawer)}
            >
                <div
                    ref={nodeRef}
                    className="bg-primary rounded-r-full shadow-lg p-1 py-0.5 text-primary-foreground cursor-pointer"
                    onClick={() => setDrawer(!drawer)}
                >
                    <ChevronRight
                        width={18}
                        className={cn("", { "rotate-180": drawer })}
                    />
                </div>
            </Draggable>
            <div className="mx-auto flex w-full flex-col items-start pt-2 transition-all duration-300">
                {headerLinks?.map((l, i) => (
                    <Link
                        key={i}
                        to={l.path}
                        className={`group flex w-full cursor-pointer items-center gap-4 overflow-hidden text-muted-foreground rounded-lg duration-300 h-12 px-3 pl-3.5 py-2 hover:bg-accent xl:gap-4 !text-nowrap ${isActive(l.path) ? "!bg-primary !text-primary-foreground" : ""}`}
                        onClick={() => setDrawer(false)}
                    >
                        <span className={`box-border w-max`}>{l.icon}</span>
                        <p
                            style={{ transitionDelay: `${i * 40 + 40}ms` }}
                            className={`translate-x-0 ${
                                drawer ?
                                    "w-full mr-auto opacity-100"
                                :   "!translate-x-28 opacity-0 overflow-hidden text-primary-foreground"
                            } sm:text-base duration-300 transition-all group-hover:!delay-0 pointer-events-none`}
                        >
                            {l.label}
                        </p>
                        {!drawer && (
                            <p className="!pointer-events-none absolute translate-x-full -right-20 z-50 overflow-hidden rounded-lg px-2 py-1 text-sm opacity-0 transition-all font-medium duration-300 group-hover:-right-2 group-hover:opacity-100 bg-primary text-primary-foreground shadow-card !text-nowrap">
                                {l.label}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </aside>
    )
}

export default Sidebar
