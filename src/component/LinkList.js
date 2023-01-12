import React from "react";
import Link from "./Link";
import { useQuery, gql } from "@apollo/client";
import { useLocation } from 'react-router-dom';
import { LINKS_PER_PAGE } from '../constants';
import { useNavigate} from 'react-router-dom';
import { getFragmentQueryDocument } from "@apollo/client/utilities";
// export const FEED_QUERY = gql`
//   {
//     feed {
//       id
//       links {
//         id
//         createdAt
//         url
//         description
//         postedBy {
//           id
//           name
//         }
//         votes {
//           id
//           user {
//             id
//           }
//         }
//       }
//     }
//   }
// `;
export const FEED_QUERY = gql`
  query FeedQuery($take: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const LinkList = () => {
  // Feed query is passed to the useQuery which contains gql templete literal query
  //   const { data } = useQuery(FEED_QUERY);
  
  const navigate = useNavigate();
  const location = useLocation();
  const isNewPage = location.pathname.includes("new");
  const pageIndexParams = location.pathname.split("/");
  const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;
  const getFragmentQueryDocument  = (isNewPage, page) => {
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const take = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = { createdAt: 'desc' };
    return { take, skip, orderBy };
  };
  const { data, loading, error, subscribeToMore } =  useQuery(FEED_QUERY, {
    variables: getFragmentQueryDocument (isNewPage, page),
  });

  const getLinksToRender = (isNewPage, data) => {
    if (isNewPage) {
      return data.feed.links;
    }
    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort(
      (l1, l2) => l2.votes.length - l1.votes.length
    );
    return rankedLinks;
  };

  // ...

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename,
        },
      });
    },
  });



//   return (
//     <div>
//       {data && (
//         <>
//           {data.feed.links.map((link, index) => (
//             <Link key={link.id} link={link} index={index} />
//           ))}
//         </>
//       )}
//     </div>
//   );

return (
    <>
      {loading && <p>Loading...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {data && (
        <>
          {getLinksToRender(isNewPage, data).map(
            (link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
              />
            )
          )}
          {isNewPage && (
            <div className="flex ml4 mv3 gray">
              <div
                className="pointer mr2"
                onClick={() => {
                  if (page > 1) {
                    navigate(`/new/${page - 1}`);
                  }
                }}
              >
                Previous
              </div>
              <div
                className="pointer"
                onClick={() => {
                  if (
                    page <=
                    data.feed.count / LINKS_PER_PAGE
                  ) {
                    const nextPage = page + 1;
                    navigate(`/new/${nextPage}`);
                  }
                }}
              >
                Next
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

// const LinkList = () => {
//   const linksToRender = [
//     {
//       id: 'link-id-1',
//       description:
//         'Prisma gives you a powerful database toolkit 😎',
//       url: 'https://prisma.io'
//     },
//     {
//       id: 'link-id-2',
//       description: 'The best GraphQL client',
//       url: 'https://www.apollographql.com/docs/react/'
//     }
//   ];

//   return (
//     <div>
//       {linksToRender.map((link) => (
//         <Link key={link.id} link={link} />
//       ))}
//     </div>
//   );
// };

export default LinkList;
