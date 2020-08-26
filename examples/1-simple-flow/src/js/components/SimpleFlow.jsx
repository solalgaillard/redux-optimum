//-------------------------------------------------------------------------------
// Central Node.
//
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
import MITLicense from '../../MIT license.png'
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
    SIMPLE_REQUEST_SUCCESS: {
      payload: {superdata: 1234, isImportant: false},
      expectedReturn: 200,
      dispatch: () => dispatch({type: "SIMPLE_REQUEST_SUCCESS", payload: apiMapping.SIMPLE_REQUEST_SUCCESS.payload})
    },
    SIMPLE_REQUEST_FAILURE: {
      payload: {superdata: 1234, isImportant: false},
      expectedReturn: 500,
      dispatch: () => dispatch({type: "SIMPLE_REQUEST_FAILURE", payload: apiMapping.SIMPLE_REQUEST_FAILURE.payload})
    },
    REQUEST_WITH_EXPIRED_TOKEN_REFRESH: {
      payload: {superdata: 1234, isImportant: false},
      expectedReturn: 500,
      dispatch: () => dispatch({type: "REQUEST_WITH_EXPIRED_TOKEN_REFRESH", payload: apiMapping.REQUEST_WITH_EXPIRED_TOKEN_REFRESH.payload})
    }
  } //Per action type

  return (
   <>
     <header>
       <h1><span>Redux</span> optimum - <span>simple flow</span></h1>
       <a href="https://github.com/solalgaillard/redux-optimum" target="_blank"><img src={Logo} /></a>

     </header>
     <div className={styles["main"]}>
       <div className={styles["left-panel"]}>
         <h2 className={styles['action-title']}>action.type: </h2>
       {optimisticrc.operations.map(item=> (
         <div className={keyActivated === item.actionType ? styles.active: null} key={item.actionType}>
           <div onClick={()=>keyActivated === item.actionType ? setKeyActivated("") : setKeyActivated(item.actionType)} className={styles.menu}>
           <div className={styles.hamburger}>
             <span></span>
             <span></span>
             <span></span>
           </div>
           <h2>{item.actionType}</h2>
           </div>
           {
             keyActivated === item.actionType && (
               <div className={styles["reducer-specs"]}>
                 config:
               <pre dangerouslySetInnerHTML={{__html:syntaxHighlight(JSON.stringify(item, function(key, value) {
                   if (typeof value === 'function') {
                     return value.toString();
                   } else {
                     return value;
                   }}, 2))}}/>
             <p>Expected return: {apiMapping[item.actionType].expectedReturn}</p>
                 <pre>Payload: <span dangerouslySetInnerHTML={{__html:syntaxHighlight(JSON.stringify(apiMapping[item.actionType].payload), null, 2)}}/></pre>
             <button onClick={apiMapping[item.actionType].dispatch}>
             Call API
             </button>
               </div>
             )
           }

         </div>
           )
       )
       }
     </div>
      <div className={styles["right-panel"]}>
        <h2>current redux store:</h2>
        <pre dangerouslySetInnerHTML={{__html:syntaxHighlight(JSON.stringify(store, null, 2))}}/>
      </div>
     </div>
     <footer>
      <img src={MITLicense} />
       <p>Solal Gaillard - 2020</p>
     </footer>
   </>
  )
};


//-------------------------------------------------------------------------------
// HOC Export, applied in two steps to allow for the conditional HMR HOC.
//-------------------------------------------------------------------------------



export default SimpleFlow;
