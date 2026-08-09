/**
 * Extracts a human-readable error message from RTK Query / Axios errors.
 *
 * RTK Query customBaseQuery returns errors as:
 *   { status: number, data: { message: string, ... } }
 *
 * This helper ensures we always surface the backend `message` field to the user.
 */
export function extractApiError(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const e = error as Record<string, any>

    // RTK Query JSON error body: { status, data: { message } | { error } }
    if (e.data?.message && typeof e.data.message === 'string') {
      return e.data.message
    }
    if (e.data?.error && typeof e.data.error === 'string') {
      return e.data.error
    }

    // RTK Query transport errors: { status: 'FETCH_ERROR' | 'TIMEOUT_ERROR' |
    // 'PARSING_ERROR', error: string }. Here there is NO data body, so without
    // this branch the caller would always fall back to the generic message.
    if (typeof e.status === 'string') {
      if (e.status === 'FETCH_ERROR') return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่'
      if (e.status === 'TIMEOUT_ERROR') return 'เซิร์ฟเวอร์ตอบสนองช้า กรุณาลองใหม่อีกครั้ง'
      // PARSING_ERROR / unknown → fall through to fallback
    }

    // RTK error string / standard Error / plain string body
    if (typeof e.error === 'string' && e.error) return e.error
    if (typeof e.message === 'string' && e.message) return e.message
    if (typeof e.data === 'string' && e.data) return e.data
  }
  return fallback
}
