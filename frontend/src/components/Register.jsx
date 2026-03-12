import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"

const registerEndpoints = {
  user: "/user-api/users",
  author: "/author-api/users",
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error("Unable to read the selected image"))
    reader.readAsDataURL(file)
  })
}

function Register({ onSwitchToLogin }) {
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitError, setSubmitError] = useState("")

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "user",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      profileImage: null,
    },
  })

  const selectedRole = useWatch({
    control,
    name: "role",
  })

  const onSubmit = async (formData) => {
    try {
      setSubmitError("")
      setSubmitMessage("")

      const profileImageFile = formData.profileImage?.[0]
      const profileImageUrl = profileImageFile
        ? await readFileAsDataUrl(profileImageFile)
        : ""

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }

      if (profileImageUrl) {
        payload.profileImageUrl = profileImageUrl
      }

      const endpoint = registerEndpoints[formData.role] ?? registerEndpoints.user
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const details = Array.isArray(data.details) ? data.details.join(", ") : ""
        const fallbackError = data.error || data.message || "Registration failed"
        throw new Error(details || fallbackError)
      }

      setSubmitMessage(data.message || "Registration successful")
      reset({
        role: formData.role,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profileImage: null,
      })
    } catch (error) {
      setSubmitError(error.message || "Registration failed")
    }
  }

  return (
    <div>
      <section className="form-card">
        <h2 className="form-title">Register</h2>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <span className="field-label">Select Role</span>

            <div className="flex flex-wrap gap-3">
              {["user", "author"].map((role) => (
                <label key={role} className="radio-chip">
                  <input
                    type="radio"
                    value={role}
                    className="h-4 w-4 accent-sky-500"
                    {...register("role")}
                  />

                  <span className={selectedRole === role ? "text-sky-600" : ""}>
                    {role === "user" ? "User" : "Author"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="field-label">First Name</span>

              <input
                type="text"
                placeholder="First name"
                className="text-input"
                {...register("firstName", {
                  required: "First Name is required",
                })}
              />

              {errors.firstName && (
                <p className="error-text">{errors.firstName.message}</p>
              )}
            </label>

            <label>
              <span className="field-label">Last Name</span>

              <input
                type="text"
                placeholder="Last name"
                className="text-input"
                {...register("lastName")}
              />
            </label>
          </div>

          <label>
            <span className="field-label">Email</span>

            <input
              type="email"
              placeholder="Email"
              className="text-input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </label>

          <label>
            <span className="field-label">Password</span>

            <input
              type="password"
              placeholder="Password"
              className="text-input"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </label>

          <label>
            <span className="field-label">Upload Profile Image</span>

            <input
              type="file"
              accept="image/*"
              className="file-input"
              {...register("profileImage")}
            />
          </label>

          {submitError ? (
            <p className="error-text text-center">{submitError}</p>
          ) : null}

          {submitMessage ? (
            <p className="muted-text text-center">{submitMessage}</p>
          ) : null}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="primary-button min-w-40"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create one !"}
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 pt-2">
            <span>If you already have an account?</span>
            <button
              type="button"
              className="font-semibold text-blue-500"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Register
