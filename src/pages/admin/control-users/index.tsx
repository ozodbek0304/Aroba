import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRoles } from "@/constants/useRoles"
import Loading from "@/layouts/loading"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import ControlUser from "./control-user"
import { useGet } from "@/hooks/useGet"
import UserCard from "./user-card"
import useCan from "@/hooks/useCan"

const ControlUsers = () => {
    const [tab, setTab] = useState("Barcha foydalanuvchilar")
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState<AddUser>()
    const { roles } = useRoles()

    const { data, isFetching } = useGet<AddUser[]>("users/users/")

    useEffect(() => {
        if (!open) {
            setCurrent(undefined)
        }
    }, [open])

    return (
        <div>
            <Tabs value={tab} defaultValue="all" onValueChange={setTab}>
                <div className="max-w-full overflow-x-auto">
                    <TabsList>
                        {([{ name: "Barcha foydalanuvchilar", id: "all" }, ...(roles || [])])?.map((role) => (
                            <TabsTrigger key={role.id} value={role.name} className="relative">
                                {role.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                <Loading loading={isFetching}>
                    <TabsContent value={tab} className="flex flex-col items-end">
                        {useCan('users/users/') && <Button icon={<Plus width={18} />} onClick={() => setOpen(true)} className="mb-4">
                            Qo'shish
                        </Button>}
                        <div className="grid w-full grid-cols-[repeat(auto-fill,_minmax(20.5rem,_auto))] gap-4 md:gap-6">
                            {data?.map((user, i) => (
                                <UserCard key={i} d={user} onEdit={() => { setCurrent(user); setOpen(true) }} />
                            ))}
                        </div>
                    </TabsContent>
                </Loading>
            </Tabs>
            <ControlUser open={open} setOpen={setOpen} current={current} />
        </div>
    )
}

export default ControlUsers