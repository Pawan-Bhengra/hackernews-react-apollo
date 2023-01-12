// import '../style/App.css';

// function App() {
//   return (
//     <div className="App">
//       <h1>hackers News</h1>
//     </div>
//   );
// }

// export default App;

// import React, { Component } from 'react';

// import LinkList from './LinkList';
// import CreateLink from './CreateLink';

// class App extends Component {
//   render() {
//     return (
//     // <LinkList />
//     <CreateLink />
//     );
//   }
// }

// export default App;

import React from "react";
import CreateLink from "./CreateLink";
import Header from "./Header";
import LinkList from "./LinkList";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Search from './Search';
import {Navigate} from 'react-router-dom';

// const App = () => {
//   return (
//     <div className="center w85 ">
//       <Header />
//       <div className="ph3 pv1 background-gray">
//         <Routes>
//           <Route path="/" element={<LinkList />} />
//           <Route path="/create" element={<CreateLink />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/search"element={<Search/>}/>
//         </Routes>
//       </div>
//     </div>
//   );
// };

const App = () => (
  <div className="center w85">
    <Header />
    <div className="ph3 pv1 background-gray">
      <Routes>
        <Route
          path="/"
          element={<Navigate replace to="/new/1" />}
        />
        <Route
          path="/create"
          element={<CreateLink/>}
        />
        <Route path="/login" element={<Login/>}/>
        <Route path="/search"element={<Search/>}/>
        <Route path="/top" element={<LinkList/>} />
        <Route
          path="/new/:page"
          element={<LinkList/>}
        />
      </Routes>
    </div>
  </div>
);

export default App;
