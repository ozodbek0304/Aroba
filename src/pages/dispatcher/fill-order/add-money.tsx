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
import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import WaveSurfer from "wavesurfer.js";
import FormAudioRecord from "@/components/form/audio-recorder";

interface thisProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    current: FillingOrder;
}

export default function AddMoney({ open, setOpen, current }: thisProps) {
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    const queryClient = useQueryClient();
    const search: any = useSearch({ from: "/_main" });

    const { patch, isPending } = useRequest({
        onSuccess: (data) => {
            setOpen(false);
            toast.success("Muvaffaqiyatli jo'natildi");
            form.reset();
            wavesurferRef.current?.stop();
            queryClient.setQueryData(['dispatchers/filling-orders/', search], (oldData: { results: FillingOrder[], total_pages: number }) => ({
                ...oldData,
                results: oldData?.results?.map((item) => {
                    if (item.id === current?.id) {
                        return { ...item, extra_amount: data }
                    } else {
                        return item
                    }
                })
            }))
        },
    },
        { contentType: "multipart/form-data" },
    );

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        disabled: isPending,
    });

    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form, current]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (data.comment || data.file) {
            await patch(`managers/additional-amount/${current?.id}/`, data)
        } else {
            form.setError('comment', { type: 'required', message: 'Sababni kiriting' })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Summa qo'shib berish</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            Summa qo'shib berish
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
                        thousandSeparator=" "
                    />
                    <FormAudioRecord methods={form} name="comment" name2="file" label="Sabab" />
                    <Button
                        icon={<Plus width={18} />}
                        className="w-full"
                        loading={isPending}
                    >
                        Tasdiqlash
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const FormSchema = z.object({
    amount: z.string({ message: "Summani kiriting" }).nonempty(),
    comment: z.string({ message: "" }).optional(),
    file: z.instanceof(Blob).optional()
});
