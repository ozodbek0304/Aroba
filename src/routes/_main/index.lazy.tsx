import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/")({
    component: () => '',
})
