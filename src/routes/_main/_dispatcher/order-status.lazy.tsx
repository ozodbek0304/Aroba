import OrderStatus from '@/pages/dispatcher/order-status'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_dispatcher/order-status')({
  component: () => <OrderStatus />,
})
