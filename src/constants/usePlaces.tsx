import { useGet } from "@/hooks/useGet"

export const usePlaces = () => {
    const { data: placesData } = useGet<Place[]>("common/points/")
    const places = placesData?.map((f) => ({ ...f, label: f.name, value: f.id })) || []

    return { places }
}
