import FileUpload2 from '@/components/form/file-upload2'
import FormInput from '@/components/form/input'
import { FormNumberInput } from '@/components/form/number-input'
import { FormPhoneNumber } from '@/components/form/phone-number'
import FormTextarea from '@/components/form/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRequest } from '@/hooks/useRequest'
import { zodResolver } from '@hookform/resolvers/zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const AddOrderer = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    const search: any = useSearch({ from: "/_main" })
    const queryClient = useQueryClient()

    const type = search?.type ? search?.type : 'cash'
    const { post, isPending } = useRequest({
        onSuccess: (res) => {
            queryClient.setQueryData(['clients/', { ...search, type: type }], (oldData: { total_pages: number, results: Client[] }) => ({
                ...oldData,
                results: oldData?.results?.length > 0 ? [res, ...oldData.results] : [res]
            }))
            queryClient.setQueryData(['orders/clients/'], (oldData: Client[]) => [res, ...oldData])
            queryClient.invalidateQueries({ queryKey: ['accountant/clients/', search] })
            toast.success('Muvaffaqiyatli qo\'shildi')
            setOpen(false)
            form.reset()
        }
    }, { contentType: 'multipart/form-data' })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        disabled: isPending
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (data.requisite || data.requisite_file || type === 'cash') {
            await post("clients/", { ...data, type })
        } else {
            toast.error("Rekvizit kiritilmadi")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                <Button icon={<Plus width={20} />}>Buyurtmachi</Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        Yangi buyurtmachi
                    </DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            Buyurtmachi qo'shish
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className='flex items-center flex-col md:flex-row gap-4'>
                        <FormInput methods={form} name='name' label='Buyurtmachi' />
                        <FormPhoneNumber control={form.control} name='phone' label='Buyurtmachi raqami' />
                    </div>
                    <div className='flex items-center flex-col md:flex-row gap-4'>
                        <FormInput methods={form} name='loading' label='Qayerdan' />
                        <FormInput methods={form} name='unloading' label='Qayerga' />
                    </div>
                    <div className='flex items-center flex-col md:flex-row gap-4'>
                        <FormNumberInput control={form.control} name='amount' thousandSeparator='  ' label='Summa' />
                        {search.type === 'transfer' && <FormPhoneNumber control={form.control} name='accounting_phone' label='Buxgalter raqami' />}
                    </div>
                    {search.type === 'transfer' && <FormTextarea methods={form} name='requisite' label='Rekvizit' />}
                    {search.type == 'transfer' && <FileUpload2 control={form.control} name='requisite_file' wrapperClassName='!min-w-full' multiple={false} />}
                    <div className='flex gap-4 justify-end'>
                        <Button loading={isPending}>Saqlash</Button>
                        <Button type='button' variant='secondary' onClick={() => setOpen(false)} disabled={isPending}>Bekor qilish</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddOrderer

const formSchema = z.object({
    name: z.string().min(1),
    phone: z.string().length(12),
    loading: z.string().min(1).or(z.number().min(1)),
    unloading: z.string().min(1).or(z.number().min(1)),
    amount: z.string().min(1).or(z.number().min(1)),
    accounting_phone: z.string().optional(),
    requisite: z.string().optional(),
    requisite_file: z.instanceof(Blob).or(z.string()).optional(),
})