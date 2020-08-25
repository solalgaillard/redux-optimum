/* eslint-disable */
import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import styles from './api-error-log.scss';



const ApiErrorLog = ({parentStyles, error, retryApiCall, cancelApiCalls}) => {
/*
  useEffect(()=>{
  })
*/
  return (
    <React.Fragment>
      {error.message
      && <div className={cx(parentStyles['api-error-log'], styles['api-error-log'])}>
        <React.Fragment>
          <p>{error.message}.</p>
          {error.retryDelay !== null
          && <React.Fragment>
            {error.retryDelay > 0 && <p>We will be retrying again in {error.retryDelay}</p>}
              <button onClick={cancelApiCalls}>Cancel</button>
              <button onClick={retryApiCall}>Retry Now</button>
          </React.Fragment>
          }
        </React.Fragment>
      </div>
      }
    </React.Fragment>
  );
}


export default connect(state => ({
    error: state.APIManagement.error,
  }),
  dispatch => ({
   retryApiCall() {
      dispatch({ type: 'All/RetryApiCalls' }); //MODIFY WITH ACTION CREATOR
    },
    cancelApiCalls() {
      dispatch({type: 'All/FLUSH_CHANNELS'});
      dispatch({type: 'APIManagement/RESET'});
    }
  })
)(ApiErrorLog)
