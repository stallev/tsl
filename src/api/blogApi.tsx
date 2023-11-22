import {
  getPostsExcerpt,
  getPostData,
  searchAllPosts,
  getCompanyData,
  getAllPostsOfCategory,
  getAllPostsSlugs,
  getMultilevelCategories,
} from './graphql/queries.js';

const OTHER_CATEGORY = 'Other';

class BlogApiService {
  static async getBlogData(query: string, variables?: object) {
    const headers = { 'Content-Type': 'application/json' }
    
    try {
      const res = await fetch('http://tsl/graphql', {
        headers,
        method: 'POST',
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      const { data } = await res.json();
      
      return data ? data : [];
    } catch (error) {
      return [];
    }
  }

  static getSortedPostsByCategoriesCount(posts: any) {
    return posts.sort(
      (a: any, b: any) => b.categories.edges.length - a.categories.edges.length,
    );
  }

  static async getOtherImagesSizesUrls(item: any) {
    if (!!item.featuredImage) {
      const featuredImageLinks: { [key: string]: string } = {};
  
      item.featuredImage.node.mediaDetails.sizes.map((imageSize: { name: string; sourceUrl: string }) => 
        featuredImageLinks[imageSize.name] = imageSize.sourceUrl
      );

      item.featuredImageLinks = featuredImageLinks;
    }
    return item;
  }

  static async getMultilevelCategoriesList() {
    const { categories: { nodes } } = await this.getBlogData(getMultilevelCategories);
    const getChildrenCategories = (item: any) => {
      if (!!item?.children?.nodes?.length) {
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          children: item.children?.nodes.map((item2: any) => getChildrenCategories(item2)),
        };
      } else {
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          children: null,
        }
      }
    };

    const mainCats: any = [];
    nodes.map((item: any) => {
      if (!item?.parentId) {
        mainCats.push(getChildrenCategories(item));
      }
    });
    
    return mainCats;
  }

  static async getPostsRequestsList(queryParams: any) {
    const { posts, categories } = await this.getBlogData(getPostsExcerpt, queryParams);

    const modifiedPosts = posts?.edges.map((item: any) => item.node);
    const { pageInfo } = posts;
    
    const postsList = modifiedPosts.map((item: any) => {
      if (!!item.featuredImage) {
        const featuredImageLinks: { [key: string]: string } = {};
  
        item.featuredImage.node.mediaDetails.sizes.map((imageSize: { name: string; sourceUrl: string }) => 
          featuredImageLinks[imageSize.name] = imageSize.sourceUrl
        );
  
        item.featuredImageLinks = featuredImageLinks;
      }
      return item;
    });

    const categoriesList = categories?.edges
      .map((item: any) => (item.node.name === OTHER_CATEGORY
        ? { ...item.node, isLast: true }
        : { ...item.node, isLast: false }));
    const multiLevelCategoriesList = await this.getMultilevelCategoriesList();
    
    return {
      postsList,
      categories: categoriesList,
      pageInfo,
      multiLevelCategoriesList,
    };
  }

  static async getSinglePostData(variables: any) {
    const { post } = await this.getBlogData(getPostData, variables);
    if (!!post?.featuredImage) {
      const featuredImageLinks: { [key: string]: string } = {};
  
      post.featuredImage.node.mediaDetails.sizes.map((imageSize: { name: string; sourceUrl: string }) => 
        featuredImageLinks[imageSize.name] = imageSize.sourceUrl
      );

      post.featuredImageLinks = featuredImageLinks;
    }

    return post;
  }

  static async getPostsByCategory(variables: any) {
    const data = await this.getBlogData(getAllPostsOfCategory, variables);

    return data;
  }

  static async getCompanyMainData() {
    const data = await this.getBlogData(getCompanyData);

    return data;
  }

  static async getPostsSlugsList() {
    const { posts } = await this.getBlogData(getAllPostsSlugs);
    const slugList = posts?.edges.map((item: any) => item.node.slug);

    return slugList;
  }

  static async searchPosts(queryParams: any) {
    const { posts: { edges } } = await this.getBlogData(searchAllPosts, queryParams);

    return edges.map((item: any) => item.node);
  }
}

export default BlogApiService;
