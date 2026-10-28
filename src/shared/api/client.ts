import { serverStatus } from './serverStatus'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

/** fetch + JSON with HTTP errors as ApiError; slow answers are reported to the server status. */
export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const end = serverStatus.begin()
  try {
    const response = await fetch(url, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
    })
    if (!response.ok) {
      throw new ApiError(response.status)
    }
    return (await response.json()) as T
  } finally {
    end()
  }
}
