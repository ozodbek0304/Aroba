import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ClassNameValue } from "tailwind-merge"

export default function SeeInView({ url, className }: { url: string, className?: ClassNameValue }) {
    return (
        <Dialog>
            <DialogTrigger className="w-full">
                {<img src={url} alt="img" className={`${className}` || ''} />}
            </DialogTrigger>
            <DialogContent className="max-w-4xl min-h-64 max-h-[80vh] w-full !p-0 bg-transparent border-none shadow-none">
                <DialogHeader className="hidden">
                    <DialogTitle className="text-left hidden">{'name'}</DialogTitle>
                    <VisuallyHidden><DialogDescription>{'name'}</DialogDescription></VisuallyHidden>
                </DialogHeader>
                <img src={url} alt="img" className="w-full max-h-[80vh] object-contain" />
            </DialogContent>
        </Dialog>
    )
}