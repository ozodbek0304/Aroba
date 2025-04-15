import { useEffect, useState } from "react"
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api"
import http from "@/lib/http"
import Spinner from "@/components/ui/spinner"
import { useTheme } from "@/layouts/theme"

interface PopoverMapProps {
    userData: {
        phone_number?: string
        lat?: number | string
        long?: number | string
    }
    fetch?: boolean
}

const PopoverMap = ({ userData, fetch }: PopoverMapProps) => {
    const [loading, setLoading] = useState(false)
    const [position, setPosition] = useState<{ lat: number; lng: number }>()
    const { theme } = useTheme()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const { res }: any = await http.get(`/driver/get_location/?phone_number=${userData?.phone_number}`)
                setPosition({
                    lat: +res?.lat,
                    lng: +res?.long,
                })
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (userData?.phone_number) {
            fetchData()
        }
    }, [userData])

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    })

    if (loadError) return <div className="flex justify-center items-center h-full">Xatolik yuz berdi</div>

    if (!isLoaded) return <div className="flex justify-center items-center h-full">Xarita yuklanyapti</div>

    return (
        <div className="relative w-full h-full overflow-hidden rounded-sm">
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/80 z-10">
                    <Spinner />
                </div>
            )}

            <GoogleMap
                center={
                    fetch ?
                        { lat: +(position?.lat ?? 41.2995), lng: +(position?.lng ?? 69.2401) }
                        : { lat: +(userData?.lat ?? 41.2995), lng: +(userData?.long ?? 69.2401) }
                }
                zoom={12}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    gestureHandling: "greedy",
                    styles: theme === "light" ? [] : darkModeStyle,
                }}
            >
                <MarkerF
                    animation={google.maps.Animation.DROP}
                    position={fetch ? (position || { lat: 41.2995, lng: 69.2401 }) : { lat: +(userData?.lat ?? 41.2995), lng: +(userData?.long ?? 69.2401) }}
                />
            </GoogleMap>
        </div>
    )
}

export default PopoverMap

const darkModeStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#22c55e" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#22c55e" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#22c55e" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
]
