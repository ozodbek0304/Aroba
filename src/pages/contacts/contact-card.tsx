import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SeeMore from "@/components/ui/see-more"
import { useUser } from "@/constants/useUser"
import useCan from "@/hooks/useCan"
import { useConfirm } from "@/hooks/useConfirm"
import { useRequest } from "@/hooks/useRequest"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { useSearch } from "@tanstack/react-router"
import { Edit2, Send, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface IProps {
    c: Contact
    onEdit: () => void
}

const ContactCard = ({ c, onEdit }: IProps) => {
    const { remove } = useRequest()
    const queryClient = useQueryClient()
    const confirm = useConfirm()

    const { info } = useUser()

    const search: any = useSearch({ from: "/_main" })

    const hasAccess = useCan("imb/contacts/$/")

    async function onDelete() {
        const isConfirmed = await confirm({ title: "O'chirilsinmi?" })
        if (isConfirmed) {
            toast.promise(remove(`imb/contacts/${c.id}/`), {
                loading: "O'chirilmoqda",
                success: () => {
                    queryClient.setQueryData(
                        ["imb/contacts/", { ...search, tab: undefined }],
                        (oldData: { results: Contact[]; count: number }) => ({
                            ...oldData,
                            results: oldData.results.filter(
                                (i) => i.id !== c.id,
                            ),
                        }),
                    )
                    return "Muvaffaqiyalti o'chirildi"
                },
            })
        }
    }

    function onSend() {
        const message = `
📋 Kontakt Tafsilotlari
- To'liq Ism: ${c.full_name}
- Telefon: ${c.phone}
- Avtomobil raqami: ${c.truck_id}
- Guvohnoma Oldi: ${c.license_front ? c.license_front : "Mavjud emas"}
- Guvohnoma Orqa: ${c.license_back ? c.license_back : "Mavjud emas"}
- Avtomobil Rasm: ${c.track_front ? c.track_front : "Mavjud emas"}
- Avtomobil Rasm: ${c.track_back ? c.track_back : "Mavjud emas"}
- Tirkama Oldi Rasm: ${c.trailer_front ? c.trailer_front : "Mavjud emas"}
- Tirkama Orqa Rasm: ${c.trailer_back ? c.trailer_back : "Mavjud emas"}
`

        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(message)}`
        window.open(telegramUrl, "_blank")
    }

    return (
        <Card className="relative flex flex-col justify-between h-max overflow-hidden text-sm">
            <CardContent className="p-0">
                {[c.track_front, c.track_back]?.filter(
                    (c) => typeof c === "string",
                )?.length > 0 && (
                    <div className="w-full h-44">
                        {[c.track_front, c.track_back]
                            ?.filter((c) => typeof c === "string")
                            ?.map((i: string, index: number) => (
                                <SeeMore
                                    key={index}
                                    d={{
                                        images: [
                                            { image: c?.license_front },
                                            { image: c?.license_back },
                                            { image: c?.track_front },
                                            { image: c?.track_back },
                                            { image: c?.trailer_front },
                                            { image: c?.trailer_back },
                                        ]?.filter((f) => f.image),
                                    }}
                                >
                                    <img
                                        src={i}
                                        alt="img"
                                        className={cn(
                                            "top-0 h-44 w-[200%] absolute object-cover",
                                            index === 0 ? "-left-[52%]" : (
                                                "-right-[52%]"
                                            ),
                                        )}
                                    />
                                </SeeMore>
                            ))}
                    </div>
                )}
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">{c.full_name}</h4>
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-primary">{c.truck_id}</p>
                            <span className="text-muted-foreground">
                                {formatPhoneNumber(998 + c.phone)}
                            </span>
                        </div>
                    </div>
                    {hasAccess && (
                        <div className="flex">
                            {info?.is_superuser && (
                                <Button
                                    icon={<Trash2 width={18} />}
                                    variant="ghost"
                                    className="!text-destructive"
                                    onClick={onDelete}
                                />
                            )}
                            <Button
                                icon={<Edit2 width={18} />}
                                variant="ghost"
                                onClick={onEdit}
                            />
                            <Button
                                icon={<Send width={18} />}
                                variant="ghost"
                                onClick={onSend}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ContactCard
