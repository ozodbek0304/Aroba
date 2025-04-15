import { FormCombobox } from '@/components/form/combobox'
import FormInput from '@/components/form/input'
import { FormNumberInput } from '@/components/form/number-input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePlaces } from '@/constants/usePlaces'
import { useRequest } from '@/hooks/useRequest'
import { zodResolver } from '@hookform/resolvers/zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const ControlRoute = ({ open, setOpen, current }: { open: boolean, setOpen: (open: boolean) => void, current: ClientRoute | undefined }) => {
    const search: any = useSearch({ from: "/_main" })
    const queryClient = useQueryClient()

    const type = search?.type ? search?.type : 'cash'

    const { post, patch, isPending } = useRequest({
        onSuccess: (res: any) => {
            if (current?.id) {
                queryClient.setQueryData(['clients/', { ...search, type: type }], (oldData: { total_pages: number, results: Client[] }) => ({
                    ...oldData,
                    results: oldData?.results?.map((o) => o.id == res?.client ? { ...o, routes: o?.routes?.map((r) => r.id == current?.id ? res : r) } : o)
                }))
                toast.success('Muvaffaqiyatli tahrirlandi')
            } else {
                queryClient.setQueryData(['clients/', { ...search, type: type }], (oldData: { total_pages: number, results: Client[] }) => ({
                    ...oldData,
                    results: oldData?.results?.map((o) => o.id == +search.client ? { ...o, routes: o?.routes?.length ? [res, ...o.routes] : [res] } : o)
                }))
                toast.success('Muvaffaqiyatli qo\'shildi')
            }
            setOpen(false)
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        disabled: isPending,
        values: { ...current, loading: current?.loading?.name, unloading: current?.unloading?.name, amount: current?.amount?.toString()?.split('.')?.[0] } as any
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (current?.id) {
            await patch(`clients/routes/${current?.id}/`, { ...data, amount: +data.amount || current?.amount })
        } else {
            await post("clients/routes/", { ...data, client: search.client, type })

        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {current?.id ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish"}
                    </DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            {current?.id ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish"}
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <FormInput methods={form} name='loading' label='Qayerdan' />
                        <FormInput methods={form} name='unloading' label='Qayerga' />
                    </div>
                    <FormNumberInput control={form.control} name='amount' label='Summa' thousandSeparator="  " />
                    <div className='flex gap-4 justify-end'>
                        <Button loading={isPending}>Saqlash</Button>
                        <Button type='button' variant='secondary' onClick={() => setOpen(false)} disabled={isPending}>Bekor qilish</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ControlRoute

const formSchema = z.object({
    loading: z.string().min(1),
    unloading: z.string().min(1),
    amount: z.string({ message: "" }).or(z.number().min(1)),
})