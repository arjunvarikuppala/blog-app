import { useForm } from 'react-hook-form'

function AddArticle() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: '',
      content: '',
    },
  })

  const onSubmit = () => {
    reset({
      title: '',
      category: '',
      content: '',
    })
  }

  return (
    <section className="compact-form-card">
      <h2 className="form-title">Add Article</h2>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          <span className="field-label">Title</span>
          <input
            type="text"
            placeholder="Title"
            className="text-input"
            {...register('title', {
              required: 'Title is required',
            })}
          />
          {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
        </label>

        <label>
          <span className="field-label">Category</span>
          <select
            className="text-input"
            {...register('category', {
              required: 'Category is required',
            })}
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
          </select>
          {errors.category ? <p className="error-text">{errors.category.message}</p> : null}
        </label>

        <label>
          <span className="field-label">Content</span>
          <textarea
            rows="6"
            placeholder="Content"
            className="text-input resize-none"
            {...register('content', {
              required: 'Content is required',
            })}
          />
          {errors.content ? <p className="error-text">{errors.content.message}</p> : null}
        </label>

        <div className="flex justify-center pt-2">
          <button type="submit" className="primary-button min-w-44">
            Publish Article
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddArticle
