import Reyestr from '@/pages/accounting/reyestr'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_accounting/reyestr')({
  component: () => <Reyestr />
})
