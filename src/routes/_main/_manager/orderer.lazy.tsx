import Orderer from '@/pages/manager/orderer'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_manager/orderer')({
    component: () => <Orderer />
})