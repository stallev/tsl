const postsQueryMaxCount = 10000;
const postsCountUsually = 10;

const PostFeaturedImage = `
  featuredImage {
    node {
      sourceUrl
      caption
      altText
      fileSize
      mediaDetails {
        sizes {
          sourceUrl
          name
          fileSize
        }
      }
    }
  }
`;

const PostCategoriesList = `
  categories(where: {hideEmpty: true}) {
    edges {
      node {
        name
        id
      }
    }
  }
`;

const PostCategoriesMultilevelList = `
  categories {
    nodes {
      id
      name
      slug
      parentId
      children {
        nodes {
          id
          name
          slug
          parentId
          children {
            nodes {
              id
              name
              slug
              parentId
              children {
                nodes {
                  id
                  name
                  slug
                  parentId
                }
              }
            }
          }
        }
      }
    }
  }
`;

const SlugsList = `
  edges {
    node {
      slug
    }
  }
`;

const PostCardContent = `
  title
  slug
  id
  excerpt
  ${PostFeaturedImage}
  ${PostCategoriesList}
`;

export const getPostsExcerpt = /* GraphQL */ `query getPostsExcerpt ($after: String) {
  posts(where: {status: PUBLISH}, after: $after, first: ${postsCountUsually}) {
    edges {
      node {
        ${PostCardContent}
      }
    }
    pageInfo {
      hasNextPage
      startCursor
      hasPreviousPage
      endCursor
    }
  }
  ${PostCategoriesList}
}
`;

export const getMultilevelCategories = /* GraphQL */ `query getMultilevelCategories {
  ${PostCategoriesMultilevelList}
}
`;

export const getPostData = /* GraphQL */ `query getPostData($id: ID!, $idType: PostIdType!) {
  post(id: $id, idType: $idType) {
    title
    content
    date
    excerpt
    ${PostFeaturedImage}
  }
}
`;

export const getAllPostsOfCategory = /* GraphQL */ `query getPostData($id: ID!, $idType: CategoryIdType!) {
  category(id: $id, idType: $idType) {
    posts {
      edges {
        node {
          ${PostCardContent}
        }
      }
    }
  }
}
`;

export const getCompanyData = /* GraphQL */ `query getCompanyData {
  companyInfoData(first: 1, where: {status: PUBLISH}) {
    edges {
      node {
        companyAddress
        companyName
        companyPhone1
        companyPhone2
        companyWorkSchedule
      }
    }
  }
}
`;

export const searchAllPosts = /* GraphQL */ `query searchAllPosts ($categoriesList: [ID]!, $query: String) {
  posts(where: {categoryIn: $categoriesList, search: $query, status: PUBLISH}) {
    edges {
      node {
        ${PostCardContent}
        ${PostCategoriesList}
      }
    }
  }
}
`;

export const getAllPostsSlugs = /* GraphQL */ `query getAllPostsSlugs {
  posts(where: {status: PUBLISH}, first: ${postsQueryMaxCount}) {
    ${SlugsList}
  }
}
`;

export const getAllCategoriesSlugs = /* GraphQL */ `query getAllCategoriesSlugs {
  categories(where: {hideEmpty: true}, first: ${postsQueryMaxCount}) {
    ${SlugsList}
  }
}
`;