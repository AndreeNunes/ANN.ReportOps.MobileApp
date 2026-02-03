import { jwtDecode } from 'jwt-decode'

export function decodeJWT(token) {
  try {
    if (!token) return null
    return jwtDecode(token)
  } catch (error) {
    console.error('❌ Erro ao decodificar JWT:', error);
    return null
  }
}
