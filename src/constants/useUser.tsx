import { useGet } from "@/hooks/useGet"

export const useUser = () => {
    const { data: info, isFetching: isFetching1 } =
        useGet<User>("auth/profile/")
    const { data: perms_data, isFetching: isFetching2 } =
        useGet<
            { name: string; dynamic: boolean; method: string; route: string }[]
        >("auth/my-perms/")

    const perms =
        (perms_data || [])?.map((f) => ({
            url: f.route?.split("v1/")?.[1] + f.name,
            method: f.method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
            dynamic: f.dynamic,
        })) || []

    return { info, perms, isFetching: isFetching1 || isFetching2 }
}
