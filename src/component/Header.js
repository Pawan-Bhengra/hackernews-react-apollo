// import React from 'react';
// import { Link } from 'react-router-dom';

// const Header = () => {
//   return (
//     <div className="flex pa1 justify-between nowrap orange">
//       <div className="flex flex-fixed black">
//         <Link to="/" className="no-underline black">
//           <div className="fw7 mr1">Hacker News</div>
//         </Link>
//         <Link to="/" className="ml1 no-underline black">
//           new
//         </Link>
//         <div className="ml1">|</div>
//         <Link
//           to="/create"
//           className="ml1 no-underline black"
//         >
//           submit
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_TOKEN } from "../constants";

// Heder component holds route for the links in the app
const Header = () => {
  // Navigate to home
  const navigate = useNavigate();
  // authToken holds token gerated for the user and soters it locally
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex pa1 justify-between nowrap orange pv4 ph4">
      <div className="flex flex-fixed white">
        <Link to="/" className="no-underline white">
          <div className="fw7 mr4">Hacker News</div>
        </Link>
        <Link to="/" className="ml1 no-underline white">
          new
        </Link>

        <div className="ml1">|</div>
        <Link to="/top" className="ml1 no-underline white">
          top
        </Link>

        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline white">
          search
        </Link>
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link to="/create" className="ml1 no-underline white">
              submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer white"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              navigate(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
