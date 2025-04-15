import Checkout from '@/pages/manager/checkout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_manager/checkout')({
    component: () => <Checkout />
})
