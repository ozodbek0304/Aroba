import { useLocation, useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { Input } from "../../ui/input"

const SearchInput = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const pathname = useLocation().pathname
    const params: any = useSearch({ from: "/_main" })

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(window.location.search)

            if (newSearchTerm) {
                params.set("search_term", newSearchTerm)
            } else {
                params.delete("search_term")
            }

            navigate({
                to:
                    newSearchTerm ?
                        `${pathname}?${params.toString()}`
                        : pathname,
            })
        }, 300)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const searchValue = inputRef.current?.value
            const params = new URLSearchParams(window.location.search)

            if (searchValue) {
                params.set("search", searchValue)
                params.set("search_term", searchValue)
                navigate({
                    to: `${pathname}?${params.toString()}`,
                })
            } else {
                navigate({ to: pathname })
            }
        }
    }

    useEffect(() => {
        if (params.search || params.search_term) {
            if (inputRef.current) {
                inputRef.current.value =
                    params.search_term || params.search || ""
            }
        } else {
            if (inputRef.current) {
                inputRef.current.value = ""
            }
        }
    }, [params.search, params.search_term, inputRef.current])

    return (
        <>
            <Input
                placeholder="Qidiruv..."
                type="search"
                className="bg-transparent"
                ref={inputRef}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        </>
    )
}

export default SearchInput
