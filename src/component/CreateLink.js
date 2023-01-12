import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FEED_QUERY } from "./LinkList";
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants';

// Mutation query for link and description
const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const navigate = useNavigate();

  // formState contains the state of the mutation like it contains description and uri
  const [formState, setFormState] = useState({
    description: "",
    url: "",
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    // This will handle to keep upto date the home page when the links and discription is added by the user by navigating to the home and reflect the the updated description and link to home page it basically update cache data manually whenever the list is updated
    update: (cache, { data: { post } }) => {
        const take = LINKS_PER_PAGE;
        const skip = 0;
        const orderBy = {createdAt: 'desc'};
      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
            take,
            skip,
            orderBy
          }
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data.feed.links],
          },
        },
        variables: {
            take,
            skip,
            orderBy
          }
      });
    },

    // It will redirect it to the home page when mutation is completed
    onCompleted: () => navigate("/"),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2 pv2 ph2 w5 f6"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value,
              })
            }
            type="text"
            placeholder="A description for the link"
          />

          <input
            className="mb2 pv2 ph2 w5 f6"
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value,
              })
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateLink;
