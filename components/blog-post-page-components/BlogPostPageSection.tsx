import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function BlogSection() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/blogs/${slug}`);
        setBlog(res.data.blog);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [router.isReady, slug]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading blog</p>;
  if (!blog) return <p>No blog found</p>;

  return (
    <div className="w-[93%] lg:w-[95%] mx-auto flex flex-col gap-4 mb-4">
      <h1 className="text-2xl lg:text-4xl text-yellow-700 font-bold">
        {blog.title}
      </h1>
      <p>By {blog.author_name}</p>
      <img src={blog.image_url} alt={blog.title} className="rounded-md" />
      <div className="whitespace-pre-line">{blog.article}</div>
    </div>
  );
}
