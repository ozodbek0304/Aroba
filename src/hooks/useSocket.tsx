import { useEffect, useRef, useState } from "react"
import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query"
import { AxiosProgressEvent } from "axios"
import http from "@/lib/http"

type UseGetOptions<T> = Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">

type WebSocketState = {
    isConnected: boolean
    sendMessage: (message: any) => void
    wsError?: string
    downloadProgress: number
}

type QueryParams = Record<string, any>

export function useSocket<T = unknown>(
    url: string,
    wsUrl: string,
    params?: QueryParams,
    options?: UseGetOptions<T>,
    myOptions?: { isPaginated?: boolean }
): UseQueryResult<T, Error> & WebSocketState {
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [retryCount, setRetryCount] = useState(0)
    const [wsError, setWsError] = useState<string | undefined>(undefined)
    const wsRef = useRef<WebSocket | null>(null)
    const queryClient = useQueryClient()

    const queryKey = [url, params]

    const query = useQuery<T, Error>({
        queryKey,
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
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        placeholderData: keepPreviousData,
    })

    useEffect(() => {
        const connectWebSocket = () => {
            const fullWsUrl = `${import.meta.env.VITE_SOCKET_URL}${wsUrl}`
            const ws = new WebSocket(fullWsUrl)
            wsRef.current = ws

            ws.onopen = () => {
                setIsConnected(true)
                setRetryCount(0)
                setWsError(undefined)
            }

            ws.onmessage = (event) => {
                try {
                    const data: any = JSON.parse(event.data)
                    handleWebSocketMessage(data)
                } catch (e) {
                    console.error("Failed to parse WebSocket message:", e)
                }
            }

            ws.onerror = () => {
                setWsError("WebSocket error occurred")
            }

            ws.onclose = () => {
                setIsConnected(false)
                if (retryCount < 5) {
                    setTimeout(() => {
                        setRetryCount((prev) => prev + 1)
                        connectWebSocket()
                    }, 5000)
                } else {
                    setWsError("WebSocket connection failed after 5 retries")
                }
            }
        }

        retryCount < 5 && wsUrl && connectWebSocket()

        return () => {
            wsRef.current?.close()
        }
    }, [])

    const handleWebSocketMessage = (message: {
        data: unknown | number
        action: "c" | "d" | "u"
    }) => {
        switch (message.action) {
            case "c":
                addData(message.data)
                break
            case "u":
                updateData(message.data)
                break
            case "d":
                deleteData(message.data as number)
                break
            default:
                console.warn(`Unhandled action type: ${message.action}`)
        }
    }

    const addData = (data: unknown) => {
        if (myOptions?.isPaginated) {
            queryClient.setQueryData<T>(queryKey, (oldData: any) => ({
                ...oldData,
                results: [...(oldData?.results || []), data],
            }) as T)
        } else {
            queryClient.setQueryData<T>(queryKey, (oldData) => {
                if (!oldData) return [data] as T
                return [...(oldData as unknown as any[]), data] as unknown as T
            })
        }
    }


    const updateData = (data: any) => {
        if (myOptions?.isPaginated) {
            queryClient.setQueryData<T>(queryKey, (oldData: any) => ({
                ...oldData,
                results: (oldData?.results || []).map((o: any) =>
                    o.id === data.id ? data : o,
                ),
            }))
        } else {
            queryClient.setQueryData<T>(queryKey, (oldData) => {
                if (!oldData) return oldData
                return (oldData as unknown as any[]).map((o) =>
                    o.id === data.id ? data : o,
                ) as unknown as T
            })
        }
    }

    const deleteData = (data: number | { id: number }) => {
        const newId = typeof data === 'object' ? data.id : data
        if (myOptions?.isPaginated) {
            queryClient.setQueryData<T>(queryKey, (oldData: any) => ({
                ...oldData,
                results: (oldData?.results || []).filter((o: any) => o.id !== newId),
            }))
        } else {
            queryClient.setQueryData<T>(queryKey, (oldData) => {
                if (!oldData) return oldData
                return (oldData as unknown as any[]).filter(
                    (o) => o.id !== newId,
                ) as unknown as T
            })
        }
    }

    const sendMessage = (message: any) => {
        if (isConnected && wsRef.current) {
            wsRef.current.send(JSON.stringify(message))
        } else {
            setWsError("Cannot send message. WebSocket is not connected.")
        }
    }

    return {
        ...query,
        isConnected,
        sendMessage,
        wsError,
        downloadProgress,
    }
}
