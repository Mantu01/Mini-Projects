import axios from "axios"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export interface ApiError {
  code: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  error?: ApiError
  data?: T
  items?: T[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export class ApiClientError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = "ApiClientError"
    this.code = code
  }
}

async function request<T>(method: "get" | "post" | "put" | "delete", url: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const response = await http.request({ method, url, params })
    const data = response.data as ApiResponse<T>

    if (!data.success) {
      throw new ApiClientError(data.error?.message ?? "Unknown error", data.error?.code ?? "UNKNOWN_ERROR")
    }

    return data.data ?? (data.items as T)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    const apiError = error as { response?: { status: number; data: { error: ApiError } } }
    if (apiError.response?.status === 404) {
      throw new ApiClientError(apiError.response.data.error?.message ?? "Resource not found", apiError.response.data.error?.code ?? "NOT_FOUND")
    }
    throw new ApiClientError(apiError.message ?? "Network error", "NETWORK_ERROR")
  }
}

export { http }
export default request
