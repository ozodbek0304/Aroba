import { useGet } from '@/hooks/useGet'
import { formatMoney } from '@/lib/format-money'
import { createFileRoute, Outlet, useLocation, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_manager')({
  component: () => <ManagerLayout />
})


const ManagerLayout = () => {
  const { data } = useGet<{ current_balance: number, cash: number, transfer: number }>('checkout/balance-info/',
    { refetchOnMount: true, refetchOnWindowFocus: true })
  const search: any = useSearch({ from: '/_main' })
  const location = useLocation()
  return (
    <main className='space-y-4'>
      {['/report','/checkout'].includes(location.pathname) && <div className="flex flex-col md:flex-row gap-y-2 gap-x-4 text-primary-foreground">
        <div className="relative w-full py-2 md:py-4 p-4 overflow-hidden rounded-md bg-primary md:max-w-[calc(50%-8px)]">
          <img src="/bg-vector.svg" alt="" className="min-w-[520px] sm:min-w-[680px] w-full absolute right-0 bottom-0" />
          <p>Hozirgi balans</p>
          {formatMoney(data?.current_balance, 'text-xl md:text-2xl font-bold', true)}
        </div>
        {search.payment_type !== 'reyestr'&&location.pathname!=='/checkout' && <div className="relative w-full py-2 md:py-4 p-4 overflow-hidden rounded-md bg-primary">
          <img src="/bg-vector.svg" alt="" className="min-w-[520px] sm:min-w-[680px] w-full absolute right-0 bottom-0" />
          <p>{search.payment_type === 'transfer' ? "Pul o'tkazish" : "Naqd"} bo'yicha qarzdorlik</p>
          {formatMoney(search.payment_type === 'transfer' ? data?.transfer : data?.cash, 'text-xl md:text-2xl font-bold', true)}
        </div>}
      </div>}
      <Outlet />
    </main>
  )
}
