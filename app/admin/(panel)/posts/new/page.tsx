import PostForm from "@/app/admin/PostForm";
import { createPost } from "@/lib/actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl">New post</h1>
      <div className="mt-8">
        <PostForm action={createPost} submitLabel="Save post" />
      </div>
    </div>
  );
}
