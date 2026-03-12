import axios from 'axios'
import { create } from 'zustand'

const authApi = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
})

export const useAuthStore = create((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  currentUser: null,

  login: async (userCred, expectedRole) => {
    try {
      set({ loading: true, error: null })

      const res = await authApi.post('/Common-api/login', userCred)
      const loggedInUser = res.data?.payload

      if (!loggedInUser) {
        throw new Error('Login response is missing user details')
      }

      if (expectedRole && loggedInUser.role !== expectedRole) {
        try {
          await authApi.get('/Common-api/logout')
        } catch {
          // Best effort only. The store still needs to reject the mismatched login.
        }

        throw new Error(
          `This account belongs to ${loggedInUser.role.toLowerCase()}, not ${expectedRole.toLowerCase()}`,
        )
      }

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        currentUser: loggedInUser,
      })

      return loggedInUser
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Login failed'

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: message,
      })

      throw err
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null })
      await authApi.get('/Common-api/logout')
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Logout failed'

      set({ error: message })
    } finally {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      })
    }
  },

  clearError: () => set({ error: null }),
}))

export const userAuth = useAuthStore
