// import React from 'react';

// const Link = (props) => {
//   const { link } = props;
//   return (
//     <div className='pv1'>
//       <div className='bg-white pv2 ph3'>
//         <div className='ttc pv2'>Description: {link.description}</div>
//          <div className='pv1'>Link: ({link.url})</div>
//       </div>
//     </div>
//   );
// };

// export default Link;

import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import { useMutation, gql } from "@apollo/client";
import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";
// ...

const take = LINKS_PER_PAGE;
const skip = 0;
const orderBy = { createdAt: "desc" };

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
    update: (cache, { data: { vote } }) => {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy,
        },
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote],
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks,
          },
        },
        variables: {
          take,
          skip,
          orderBy,
        },
      });
    },
  });

  return (
    <div className="flex mt2 items-start pv1">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: "pointer" }}
            onClick={vote}
          >
            {/* ▲ */}
            <div className="f4">
            👍 
            {/* thumbs up sign */}
            </div>
          </div>
        )}
      </div>

      <div className="ml1">
        <div>
          {/* {link.description} ({link.url}) */}
          <div className="ttc pv2">Description: {link.description}</div>
          <div className="pv1">Link: ({link.url})</div>
        </div>
        {
          <div className="f6 lh-copy gray">
            {/* it shows the vote count */}
            {link?.votes?.length} votes | by{" "}
            {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        }
      </div>
    </div>
  );
};

export default Link;
