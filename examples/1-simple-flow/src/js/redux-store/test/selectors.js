/* eslint-disable */
import {get} from "lodash";
import moment from "moment-timezone";


const isLoggedIn = state => (
  state.company.hasOwnProperty('clientId')
);

const isDIFUser = state => (
  get(state, 'company.platform.type') === 'DIF'
);

const isDSCFUser = state => (
  get(state, 'company.platform.type') === 'DSCF'
);

const isSearchCompanyDone = state => (
  state.company.hasOwnProperty('companyPostalCode')
  && state.company.companyPostalCode
  && state.company.companyPostalCode.length > 0
  && (!state.company.hasOwnProperty('signersInfo')
      || !state.company.signersInfo
      || state.company.signersInfo.length === 0)
);

const isAddSignersDone = state => (
  state.company.hasOwnProperty('signersInfo')
  && state.company.signersInfo
  && state.company.signersInfo.length > 0
  && !(state.company.signersInfo.find(signer=>signer.email === state.company.users.currentUser.emailAddress) &&
      !state.company.users.currentUser.userAuthorized)
  && (!state.company.hasOwnProperty('contactsInfo')
      || !state.company.contactsInfo
      || state.company.contactsInfo.length === 0)
);

const isAddContactsDone = state => (
  state.company.hasOwnProperty('contactsInfo')
  && state.company.contactsInfo
  && state.company.contactsInfo.length > 0
  && (!state.company.hasOwnProperty('businessDescription')
      || !state.company.businessDescription
      || state.company.businessDescription.length === 0)
);

const isAddBusinessInfoDone = state => (
  state.company.hasOwnProperty('businessDescription')
  && state.company.businessDescription
  && state.company.businessDescription.length > 0
  && (!state.company.hasOwnProperty('accountingSofware')
      || !state.company.accountingSoftware
      || state.company.accountingSoftware.length === 0)
);

const isChooseAccountingSoftwareDone = state => (
  state.company.hasOwnProperty('accountingSoftware')
  && state.company.accountingSoftware
);

const isSetUpDone = state => (
  state.company.hasOwnProperty('isVerified')
  && state.company.isVerified
);

const isSignatureDone = state => (
  state.company.hasOwnProperty('hasDocsBeenSigned')
  && state.company.hasDocsBeenSigned
);


const isWebUserASigner = state => {
  const currentUserEmail = state.company.users.currentUser.emailAddress
  const signers = state.company.signersInfo
  return signers.some(item=> item.email === currentUserEmail)
};


const isSignatureCancelledAndNoSigners = state => {
  const { signatureCancelled, signersInfo } = state.company;
  return signatureCancelled && !signersInfo.length
};

const getCurrentCustomer = ({company, invoices}) => {
  const { customersInfo } = company;
  const { customerId } = invoices;
  return customersInfo.length ? customersInfo.find(customer => customer.customerId === customerId) : {};
};

const getAlwaysPayMeEarly = state => {
  const customer = getCurrentCustomer(state);
  return customer[`alwaysPayEarly${state.company.platform.type}`] || {frequency: null, date: null};
};

const getEarlyPaymentDates = state => {
  const customer = getCurrentCustomer(state);
  const platform = state.company.platform.type;
  return customer[`earlyPaymentDates${platform}`];
};

const getCompanyClosedDays = state => {
  return state.company.closedDates[state.company.defaultCurrency]
      .filter(d => moment(d).isBefore(moment().add(1, 'y')));
};

const isAlwaysPayMeEarlyActivated = state => {
  const ape = getAlwaysPayMeEarly(state);
  return state.company.platform.type !== "DIF" ? ape.activated || ape.frequency : false
};

export default {
  isLoggedIn,
  isDIFUser,
  isDSCFUser,
  isSearchCompanyDone,
  isAddSignersDone,
  isAddContactsDone,
  isAddBusinessInfoDone,
  isChooseAccountingSoftwareDone,
  isSetUpDone,
  isSignatureDone,
  isWebUserASigner,
  isAlwaysPayMeEarlyActivated,
  isSignatureCancelledAndNoSigners,
  getCurrentCustomer,
  getAlwaysPayMeEarly,
  getEarlyPaymentDates,
  getCompanyClosedDays
};
