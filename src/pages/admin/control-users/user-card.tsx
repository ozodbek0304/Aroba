import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import SeeMore from "@/components/ui/see-more"
import { useRoles } from "@/constants/useRoles"
import useCan from "@/hooks/useCan"
import { useConfirm } from "@/hooks/useConfirm"
import { useRequest } from "@/hooks/useRequest"
import { useQueryClient } from "@tanstack/react-query"
import { Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"

const UserCard = ({ d, onEdit }: { d: AddUser; onEdit: () => void }) => {
    const confirm = useConfirm()
    const queryClient = useQueryClient()

    const { roles } = useRoles()

    const rr = useRequest()

    async function deleteUserFn() {
        const isConfirmed = await confirm({
            title: d.first_name + " " + d.last_name + " o'chirilsinmi?",
        })
        await rr.remove(`users/users/${d?.id}/`, {}, { isConfirmed })
        toast.success("Muvaffaqiyatli o'chirildi")
        queryClient.setQueryData(["users/users/"], (oldData: AddUser[]) =>
            oldData?.filter((o) => o.id != d?.id),
        )
    }

    const hasAccess = useCan("users/users/$/")

    return (
        <Card
            className="w-full sm:max-w-lg relative overflow-hidden"
            loading={rr.isPending}
        >
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4">
                    <Avatar className="w-20 h-20 overflow-hidden rounded-full">
                        {d?.photo && (
                            <SeeMore d={{ images: [{ image: d?.photo }] }}>
                                <AvatarImage src={d?.photo} />
                            </SeeMore>
                        )}
                        <AvatarFallback>
                            {d?.first_name?.[0] + " " + d?.last_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <p className="sm:text-base text-right">
                        {d?.first_name} {d?.last_name}
                    </p>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0 pb-2">
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground font-medium">Rol:</p>
                    <p>
                        {d?.roles
                            ?.map((r) => roles?.find((rr) => rr.id == +r)?.name)
                            .join(", ")}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground font-medium">
                        Telefon raqami:
                    </p>
                    <a
                        className="font-semibold hover:text-primary"
                        href={"tel: " + d?.phone}
                    >
                        {d?.phone}
                    </a>
                </div>
            </CardContent>
            {hasAccess && (
                <CardFooter className="!p-4 !pt-0 flex justify-end  -mr-2 -mb-2">
                    <Button
                        icon={<Trash2 width={18} />}
                        className="!text-destructive"
                        size="icon"
                        variant="ghost"
                        onClick={deleteUserFn}
                    />
                    <Button
                        icon={<Edit2 width={18} />}
                        size="icon"
                        className="text-muted-foreground"
                        variant="ghost"
                        onClick={onEdit}
                    />
                </CardFooter>
            )}
        </Card>
    )
}

export default UserCard
