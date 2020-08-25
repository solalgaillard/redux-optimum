/* eslint-disable */
//-------------------------------------------------------------------------------
// Central Node.
//
// Uses HMR in the dev environment only, with a conditional require and a
// conditional HOC on export that requires that we divide their applications
// in two.
//
// The component observes the clientId key in the redux store to determine
// whether the user is logged in or not (see company selectors).
//
// The component fetches the company api on load.
// If the api cannot be reached and the token cannot be
// refreshed, it loads the loggedOut node and pre-loads the loggedIn node with
// loadable.
// Otherwise, it does the opposite.
//
// A Modal box is conditionally rendered at this node level, provided
// that the component exists. The component is passed as a prop with the HOC
// getModal. Other deeply nested components can register a modal with the
// registerModalHOC. It is the only part of the app where the modal will be
// displayed. It was chosen at this level since it is a common ancestor branch
// of both the loggedIn and LoggedOut nodes and the modal might also be
// displayed at some point in the future when the loggedOut branch has been
// loaded.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import optimisticrc from "../optimisticrc";
import styles from './simple-flow.scss'
import Logo from '../../redux-optimum.png'
import cx from "classnames"
//-------------------------------------------------------------------------------
// Component
//-------------------------------------------------------------------------------

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + styles[cls] + '">' + match + '</span>';
  });
}

const SimpleFlow = ({}) => {

  const dispatch = useDispatch();

  const [keyActivated, setKeyActivated] = useState("");

  const store = useSelector(store=>store);
  const testKey = useSelector(store=>store.test);
  const queueManager = useSelector(store=>store.QueueManager);


  const apiMapping = {
    TEST: {
      payload: {superdata: 1234, isImportant: false},
      expectedReturn: 200,
      dispatch: () => dispatch({type: "TEST", payload: apiMapping.TEST.payload})
    },
    TEST2: {
      payload: {superdata: 1234, isImportant: false},
      expectedReturn: 500,
      dispatch: () => dispatch({type: "TEST2", payload: apiMapping.TEST.payload})
    },
    TEST3: {
      payload: {superdata: 1234, isImportant: false},
      expectedReturn: 500,
      dispatch: () => dispatch({type: "TEST3", payload: apiMapping.TEST.payload})
    }
  } //Per action type

  return (
   <>
     <header>
       <h1><span>Redux</span> optimum - <span>simple flow</span></h1>
       <img src={Logo} />

     </header>
     <div className={styles["main"]}>
       <div className={styles["left-panel"]}>
       {optimisticrc.operations.map(item=> (
         <div key={item.actionType}>
           <div onClick={()=>keyActivated === item.actionType ? setKeyActivated("") : setKeyActivated(item.actionType)} className={styles.menu}>
           <div className={cx(styles.hamburger, keyActivated === item.actionType ? styles.active: null)}>
             <span></span>
             <span></span>
             <span></span>
           </div>
           <h2>{item.actionType}</h2>
           </div>
           {
             keyActivated === item.actionType && (
               <>
               <pre dangerouslySetInnerHTML={{__html:syntaxHighlight(JSON.stringify(item, function(key, value) {
                   if (typeof value === 'function') {
                     return value.toString();
                   } else {
                     return value;
                   }}, 2))}}/>
             <p>Expected return: {apiMapping[item.actionType].expectedReturn}</p>
             <p>Payload: {JSON.stringify(apiMapping[item.actionType].payload)}</p>
             <button onClick={apiMapping[item.actionType].dispatch}>
             Call API
             </button>
               </>
             )
           }

         </div>
           )
       )
       }
     </div>
      <div className={styles["right-panel"]}>
        Store:
        <pre dangerouslySetInnerHTML={{__html:syntaxHighlight(JSON.stringify(store, null, 2))}}/>
      </div>
     </div>
   </>
  )
};


//-------------------------------------------------------------------------------
// HOC Export, applied in two steps to allow for the conditional HMR HOC.
//-------------------------------------------------------------------------------



export default SimpleFlow;
