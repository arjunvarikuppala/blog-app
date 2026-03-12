import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useAuthStore } from '../store/userAuth'

const roleMap = {
  user: 'USER',
  author: 'AUTHOR',
  admin: 'ADMIN',
}

function Login({ onLoginSuccess }) {
  const [submitMessage, setSubmitMessage] = useState('')
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const submitError = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: 'user',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    clearError()
  }, [clearError])

  const selectedRole = useWatch({
    control,
    name: 'role',
  })

  const onSubmit = async (formData) => {
    try {
      setSubmitMessage('')
      clearError()

      const user = await login(
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        roleMap[formData.role],
      )

      setSubmitMessage('Login successful')
      reset({
        role: formData.role,
        email: '',
        password: '',
      })
      onLoginSuccess?.(user)
    } catch (error) {
      void error
    }
  }

  return (
    <section className="compact-form-card">
      <h2 className="form-title">Login</h2>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <span className="field-label">Select Role</span>
          <div className="flex flex-wrap gap-3">
            {['user', 'author', 'admin'].map((role) => (
              <label key={role} className="radio-chip">
                <input
                  type="radio"
                  value={role}
                  className="h-4 w-4 accent-sky-500"
                  {...register('role')}
                />
                <span className={selectedRole === role ? 'text-sky-600' : ''}>
                  {role === 'user' ? 'User' : role === 'author' ? 'Author' : 'Admin'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <label>
          <span className="field-label">Email</span>
          <input
            type="email"
            placeholder="Email"
            className="text-input"
            {...register('email', {
              required: 'Email is required',
            })}
          />
          {errors.email ? <p className="error-text">{errors.email.message}</p> : null}
        </label>

        <label>
          <span className="field-label">Password</span>
          <input
            type="password"
            placeholder="Password"
            className="text-input"
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password ? <p className="error-text">{errors.password.message}</p> : null}
        </label>

        {submitError ? <p className="error-text text-center">{submitError}</p> : null}
        {submitMessage ? <p className="muted-text text-center">{submitMessage}</p> : null}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="primary-button min-w-40"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Login
