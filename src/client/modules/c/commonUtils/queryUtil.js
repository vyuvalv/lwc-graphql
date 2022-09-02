export const CATEGORIES_QUERY = {
    query: `{
        categories{
            categories{
              ID
              name
            }
          }
    }`
};
/*
- CATEGORIES_QUERY :
-   [{"ID":"402435","name":"APEX"},{"ID":"11198","name":"Certification"}]
*/
export const TAGS_QUERY = {
    query: `{
            tags{
                tags{
                  ID
                  name
                }
              }
        }`
};
/*
- TAGS_QUERY :
[{"ID":"402435","name":"APEX"},{"ID":"4276","name":"api"}]
*/
export function GeneratePostsQuery( itemsPerPage, pageNumber, search='' ) {
    return {
        query: `{
        posts( search:"${search}", itemsPerPage:${itemsPerPage}, pageNumber:${pageNumber}){
          found
          posts{
            ID
            title
            featured_image
            excerpt
            tags{
              ID
              name
            }
            categories{
              ID
              name
            }
          }
        }
      }`
    };
}

export function GeneratePostQuery(postId) {
    return {
        query: `{
            get_post(postId:"${postId}"){
              post{
                ID
                title
                featured_image
                excerpt
                content
                tags{
                  ID
                  name
                }
                categories{
                  ID
                  name
                }
              }
            }
          }`
    }
}

