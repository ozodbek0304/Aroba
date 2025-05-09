import http from "@/lib/http"
import {
    keepPreviousData,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from "@tanstack/react-query"
import { useState } from "react"
import { AxiosProgressEvent } from "axios"

type UseGetOptions<T> = Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">


export function useGet<T = unknown>(
    url: string,
    params?: Record<string, any>,
    options?: UseGetOptions<T>,
): UseQueryResult<T, Error> & { downloadProgress: number } {
    const [downloadProgress, setDownloadProgress] = useState(0)
    const query = useQuery<T, Error>({
        queryKey: params ? [url, { ...params, search_term: undefined, page_tabs: undefined, tabs: undefined }] : [url],
        queryFn: async () => {
            const response = await http.get(url, {
                params,
                onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        )
                        setDownloadProgress(percentCompleted)
                    }
                },
            })
            return response.data as T
        },
        ...options,
        retryDelay: 1000,
        retry: 3,
        placeholderData: keepPreviousData,
    })

    return {
        ...query,
        downloadProgress,
    }
}
