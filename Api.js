// // This file contains all Common function related to API(GET, POST, POST FORM, DELETE)

import * as Config from './ApiConfig';
import {Alert} from 'react-native';
import * as Storage from '../service/AsyncStoreConfig';
import {
  BaseUrl,
  change_password,
  approved_listing,
  weekly_mobile_payment,
  weekly_orange_payment,
  access_mobile_payment,
  access_orange_payment,
  get_orange_payment_status,
  funding,
  logout,
  userListing,
  access_cash_payment,
  notifications,
  weekly_cash_payment,
  weekly_payments,
  weekly_card_payment,
  access_card_payment,
  profile,
  paymentStatus,
  avatarUpdate,
  update,
  myProject,
  projectTypes,
  cacProjects,
  cacProjectParticipate,
  cacTrainings,
  cacTrainingParticipate,
  contact,
  forgotPassword,
} from '../service/ApiConfig';
import RNFetchBlob from 'rn-fetch-blob';
import {strings} from '../strings';

async function Api(headers, method, url, body) {
  const URL = `${BaseUrl}${url}`;

  console.log(
    '\n=======================================' +
      '\n\n' +
      'Header ==>> ' +
      JSON.stringify(headers) +
      '\n' +
      'METHOD ==>>  ' +
      method +
      '\n' +
      'Api ==>>  ' +
      URL +
      '\n' +
      'Request ==>>  ' +
      JSON.stringify(body) +
      '\n\n' +
      '=======================================',
  );

  return fetch(URL, {
    headers: headers,
    method: method,
    body: body,
  })
    .then(async (response) => {
      const status = response.status;
      const data = await response.json();
      console.log('response data gettingg=====', data)
      console.log(
        '\n=======================================' +
          '\n\n' +
          'status ==>> ' +
          status +
          '\n' +
          'Response ==>>  ' +
          JSON.stringify(data) +
          '\n\n' +
          '=======================================',
      );

      return {status: status, data: data};
    })
    .catch(function (error) {
      console.log('Request failed', error);
      alert(strings.UNEXPECTED_FAILURE);
    });
}

async function chatApi(headers, method, url, body) {
  const URL = url;

  console.log(
    '\n=======================================' +
      '\n\n' +
      'Header ==>> ' +
      JSON.stringify(headers) +
      '\n' +
      'METHOD ==>>  ' +
      method +
      '\n' +
      'Api ==>>  ' +
      URL +
      '\n' +
      'Request ==>>  ' +
      JSON.stringify(body) +
      '\n\n' +
      '=======================================',
  );

  return fetch(URL, {
    headers: headers,
    method: method,
    body: body,
  })
    .then(async (response) => {
      const status = response.code;
      const data = await response.json();

      console.log(
        '\n=======================================' +
          '\n\n' +
          'status ==>> ' +
          status +
          '\n' +
          'Response ==>>  ' +
          JSON.stringify(data) +
          '\n\n' +
          '=======================================',
      );

      return {status: status, data: data};
    })
    .catch(function (error) {
      console.log('Request failed', error);
      alert(strings.UNEXPECTED_FAILURE);
    });
}

export const addProjectApi = async (body) => {
  // console.log(JSON.stringify(body))

  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  let headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'multipart/form-data',
    Language: lang,
  };
  let url = `${BaseUrl}${myProject}`;

  console.log(
    '\n=======================================' +
      '\n\n' +
      'Header ==>> ' +
      JSON.stringify(headers) +
      '\n' +
      'METHOD ==>>  ' +
      'POST' +
      '\n' +
      'Api ==>>  ' +
      url +
      '\n' +
      'Request ==>>  ' +
      JSON.stringify(body) +
      '\n\n' +
      '=======================================',
  );
  //  documents
  let documents = {
    name: 'documents',
    data: null,
  };
  if (body.imageData != null) {
    documents = {
      name: 'documents',
      filename: body.imageName,
      type: body.imageData.mime,
      data: RNFetchBlob.wrap(body.imageData.path),
    };
  }
  console.log('------' + JSON.stringify(documents));

  return await RNFetchBlob.fetch('POST', url, headers, [
    {name: 'name', data: body.name},
    {name: 'description', data: body.description},
    {name: 'project_type_id', data: body.projectType.toString()},
    documents,
  ])
    .then(async (response) => {
      const status = response.Status;
      const data = await response.json();

      console.log(
        '\n=======================================' +
          '\n\n' +
          'status ==>> ' +
          status +
          '\n' +
          'Response ==>>  ' +
          JSON.stringify(data) +
          '\n\n' +
          '=======================================',
      );
      return {status: status, data: data};
    })
    .catch(function (error) {
      console.log('Request failed', error);
      alert(strings.UNEXPECTED_FAILURE);
    });
};

export const updateAvatar = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  let headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'multipart/form-data',
    Language: lang,
  };
  let url = `${BaseUrl}${Config.avatarUpdate}`;
  let avatar = {
    name: 'avatar',
    data: null,
  };
  if (body.imageData != null) {
    avatar = {
      name: 'avatar',
      filename: body.imageName,
      type: body.imageData.mime,
      data: RNFetchBlob.wrap(body.imageData.path),
    };
  }
  return await RNFetchBlob.fetch('POST', url, headers, [avatar])
    .then(async (response) => {
      const status = response.Status;
      const data = await response.json();
      return {status: status, data: data};
    })
    .catch(function (error) {
      console.log('Request failed', error);
      alert(strings.UNEXPECTED_FAILURE);
    });
};

export const loginApi = async (url, body) => {
  const lang = await Storage.getLanguage();
  return await Api(
    {'Content-Type': 'multipart/form-data', Language: lang},
    'POST',
    url,
    body,
  );
};

export const SignupApi = async (url, body) => {
  const lang = await Storage.getLanguage();
  return await Api(
    {'Content-Type': 'multipart/form-data', Language: lang},
    'POST',
    url,
    body,
  );
};

export const changePasswordApi = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    change_password,
    body,
  );
};

export const getProfileApi = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    profile,
  );
};
export const updateProfileApi = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    update,
    body,
  );
};
export const getProjectTypes = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    projectTypes,
  );
};
export const getMyProjects = async (pageNumber) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    myProject + '?page=' + pageNumber,
  );
};
export const getProjectDetails = async (id) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    myProject + '/' + id,
  );
};
export const getCacProjects = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    cacProjects,
  );
};
//project participation
export const participateApi = async (project_id) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    cacProjectParticipate + project_id,
  );
};
export const getCacTrainings = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    cacTrainings,
  );
};
//training participation
export const participateTrainingApi = async (project_id) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    cacTrainingParticipate + project_id,
  );
};
//faq
export const faqApi = async () => {
  const lang = await Storage.getLanguage();
  return await Api({Accept: 'application/json'}, 'GET', 'faq?language=' + lang);
};
//send contact reequest
export const sendContactRequest = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    contact,
    body,
  );
};
//forgot api
export const sendForgotPasswordRequest = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    forgotPassword,
    body,
  );
};
export const getPaymentStatus = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    paymentStatus,
  );
};
export const accessCashPayment = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    access_cash_payment,
  );
};
export const accessCardPayment = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    access_card_payment,
    body,
  );
};
export const accessMobileApi = async (body, phoneNumber) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
      phone: phoneNumber,
    },
    'POST',
    access_mobile_payment,
    null,
  );
};

export const accessOrangeApi = async (body, phoneNumber) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
      phone: phoneNumber,
    },
    'POST',
    access_orange_payment,
    null,
  );
};

export const getWeeklyPayments = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    weekly_payments,
  );
};
export const weeklyCashPayment = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    weekly_cash_payment,
    body,
  );
};
export const weeklyCardPayment = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    weekly_card_payment,
    body,
  );
};


export const weeklyMobileApi = async (body, phoneNumber) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
      phone: phoneNumber,
    },
    'POST',
    weekly_mobile_payment,
    body,
  );
};

export const weeklyOrangeApi = async (body, phoneNumber) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  console.log('body getting===', body)
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
      phone: phoneNumber,
    },
    'POST',
    weekly_orange_payment,
    body,
  );
};

export const orangeStatusApi = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  console.log('body getting===', body)
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    get_orange_payment_status,
    body,
  );
};


export const getNotifications = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    notifications,
  );
};
export const logoutApi = async () => {
  const token = await Storage.getData('userToken');
  return await Api(
    {Accept: 'application/json', Authorization: 'Bearer ' + token},
    'POST',
    logout,
  );
};
export const getUserListing = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    userListing,
  );
};
export const getApprovedListing = async () => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'GET',
    approved_listing,
  );
};
export const fundingApi = async (body) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await Api(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
      Language: lang,
    },
    'POST',
    funding,
    body,
  );
};
export const chatmessgaekeyApi = async (id) => {
  const token = await Storage.getData('userToken');
  const lang = await Storage.getLanguage();
  return await chatApi(
    {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
    'GET',
    `https://api.entrepreneur-numerique.africa/chat-http/api/v1.1/chat/messageKey?userID=${id}`,
  );
};
