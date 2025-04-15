import { FormNumberInput } from "@/components/form/number-input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRequest } from "@/hooks/useRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormInput from "@/components/form/input";

interface thisProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddSend({ open, setOpen }: thisProps) {

    const queryClient = useQueryClient();
    const search: any = useSearch({ from: "/_main" });

    const { post, isPending } = useRequest(
        {
            onSuccess: (res) => {
                setOpen(false);
                toast.success("Muvaffaqiyatli jo'natildi");
                form.reset();
                queryClient.setQueryData(['checkout/transactions/', search], (oldData: { results: Send[], total_pages: number }) => ({
                    ...oldData,
                    results: oldData?.results.length > 0 ? [...oldData.results, res] : [res]
                }))
            },
        },
    );

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        disabled: isPending,
    });

    function handleClose() {
        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await post('checkout/transactions/', data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chiqim qo'shish</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            Chiqim qo'shish
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormNumberInput
                        control={form.control}
                        name="amount"
                        label="Summa"
                        thousandSeparator="  "
                    />
                    <FormInput methods={form} name="comment" label="Izoh" />
                    <div className="flex gap-4 justify-end">
                        <Button
                            loading={isPending}
                        >
                            Tasdiqlash
                        </Button>
                        <Button variant='secondary' type="button" onClick={handleClose}>Bekor qilish</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const FormSchema = z.object({
    amount: z.string({ message: "Summani kiriting" }).nonempty(),
    comment: z.string({ message: "" })
});
