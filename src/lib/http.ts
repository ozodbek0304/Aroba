import { redirect } from "@tanstack/react-router"
import axios from "axios"

const http = axios.create({
    baseURL: import.meta.env.VITE_DEFAULT_URL,
})

const getAccessToken = () => localStorage.getItem("token")
const getRefreshToken = () => localStorage.getItem("refresh")

const refreshToken = async () => {
    const refresh = getRefreshToken()
    const response = await axios.post(
        import.meta.env.VITE_DEFAULT_URL + "refresh_token/",
        { refresh },
    )
    localStorage.setItem("token", response.data.access)
    return response.data.access
}

http.interceptors.request.use(
    (config) => {
        const token = getAccessToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const newAccessToken = await refreshToken()
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return http(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem("token")
                localStorage.removeItem("refresh")
                throw redirect({ to: "/auth" })
            }
        }
        return Promise.reject(error)
    },
)

export default http
