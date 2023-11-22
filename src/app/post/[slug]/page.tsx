import { PostProps } from "@/types/post/postTypes";
import BlogApiService from "@/api/blogApi";

export default async function Post({ params } : PostProps) {
  const variables = {
    id: params.slug,
    idType: 'SLUG'
  };
  const postData = await BlogApiService.getSinglePostData(variables);
  return (
    <div>
      <h1>Post with slug {postData.title}</h1>
      <div dangerouslySetInnerHTML={{__html: postData.content}} />
    </div>
  )
}

export async function generateStaticParams() {
  const slugList = await BlogApiService.getPostsSlugsList();
 
  return slugList.map((slug: string) => ({
    slug,
  }));
}
