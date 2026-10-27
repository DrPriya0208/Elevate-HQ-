import { notFound } from "next/navigation";
import PostForm from "@/app/admin/PostForm";
import { updatePost } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit post</h1>
      <div className="mt-8">
        <PostForm
          action={updatePost.bind(null, post.id)}
          submitLabel="Save changes"
          post={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            coverImage: post.coverImage ?? "",
            content: post.content,
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
