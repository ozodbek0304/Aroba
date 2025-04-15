import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Toaster } from "@/components/ui/sonner"

import { ThemeProvider } from "@/layouts/theme"
import { ConfirmProvider } from "@/layouts/confirm"
import { PromptProvider } from "@/layouts/prompt"
import { PromptWithCauseProvider } from "@/layouts/prompt-with-causer"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="theme">
            <ConfirmProvider>
                <PromptProvider>
                    <PromptWithCauseProvider>
                        <Outlet />
                    </PromptWithCauseProvider>
                </PromptProvider>
            </ConfirmProvider>
            <Toaster position="top-right" />
        </ThemeProvider>
    )
}
