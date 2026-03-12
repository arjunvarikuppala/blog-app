import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/userAuth";

function getAuthorName(author) {
  if (!author || typeof author === "string") {
    return "Unknown author";
  }

  const fullName = [author.firstName, author.lastName]
    .filter(Boolean)
    .join(" ");
  return fullName || author.email || "Unknown author";
}

function formatPublishedDate(value) {
  if (!value) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function UserProfile() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const readArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("http://localhost:4000/user-api/articles", {
          withCredentials: true,
        });

        if (isMounted) {
          setArticles(res.data?.payload ?? []);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Unable to load articles";

          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    readArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="article-board">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Reader space
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-amber-100">
            Latest articles from all authors
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            {currentUser?.firstName
              ? `Welcome ${currentUser.firstName}. Explore the newest posts across every author.`
              : "Explore the newest posts across every author."}
          </p>
        </div>

        <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600">
          {articles.length} article{articles.length === 1 ? "" : "s"}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[28px] border  bg-white/75 px-6 py-12 text-center text-slate-600">
          Loading articles...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mt-8 rounded-[28px] border bg-red-50 px-6 py-12 text-center text-red-600">
          {error}
        </div>
      ) : null}

      {!loading && !error && articles.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white/75 px-6 py-12 text-center text-slate-600"></div>
      ) : null}

      {!loading && !error && articles.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {articles.map((article) => (
            <article
              key={article._id}
              className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white/90 p-5 "
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {article.category}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {article.comments?.length ?? 0} comments
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-slate-800">
                {article.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                {article.content.length > 180
                  ? `${article.content.slice(0, 180)}...`
                  : article.content}
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-700">
                  {getAuthorName(article.author)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Published {formatPublishedDate(article.createdAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default UserProfile;
