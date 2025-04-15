import { Button } from "@/components/ui/button"
import { useGet } from "@/hooks/useGet"
import { useSearch } from "@tanstack/react-router"
import { Download, Plus } from "lucide-react"
import { useState } from "react"
import AddContact from "./control-contact"
import ContactCard from "./contact-card"
import ParamPagination from "@/components/as-params/pagination"
import { useDownloadAsExcel } from "@/hooks/useDownloadAsExcel"
import { ParamCombobox } from "@/components/as-params/combobox"

const Contacts = () => {
    const [addContact, setAddContact] = useState(false)
    const [current, setCurrent] = useState<Contact>()

    const search: any = useSearch({ from: "/_main" })
    const { data, isFetching } = useGet<{
        results: Contact[]
        total_pages: number
    }>("imb/contacts/", { ...search, tab: undefined })

    const { trigger, isFetching: isExcelFetching } = useDownloadAsExcel({
        url: "imb/contacts-excel/",
        name: "Kontaktlar",
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <ParamCombobox
                    options={[
                        { label: "To'ldirilgan", value: "-image_count" },
                        { label: "To'ldirilmagan", value: "image_count" },
                    ]}
                    paramName="order"
                    label="To'ldirilganlik holati"
                    returnVal="value"
                />
                <ParamPagination
                    totalPages={data?.total_pages}
                    disabled={isFetching}
                />
                <div className="flex gap-2">
                    <Button
                        icon={<Download width={18} />}
                        loading={isExcelFetching}
                        onClick={trigger}
                    >
                        Yuklab olish
                    </Button>
                    <Button
                        icon={<Plus width={18} />}
                        onClick={() => {
                            setAddContact(true)
                            setCurrent({} as Contact)
                        }}
                    >
                        Kontakt
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(20rem,_auto))] gap-4 items-end">
                {data?.results?.map((c, i) => (
                    <ContactCard
                        key={i}
                        c={c}
                        onEdit={() => {
                            setAddContact(true), setCurrent(c)
                        }}
                    />
                ))}
            </div>
            <AddContact
                open={addContact}
                setOpen={setAddContact}
                current={current}
            />
        </div>
    )
}

export default Contacts

const isBlockedOptions = [
    { label: "Bloklanganlar", value: "true" },
    { label: "Bloklanmaganlar", value: "false" },
]
