import {API} from '../axios.config';

export const paymentViaPaypal = async (params, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const response = await API.apiService.post(
      '/api/payment/paypal/new',
      params,
      {
        headers,
      },
    );
    return response?.data;
  } catch (error) {
    console.log({error});
  }
};

export const paymentViaStripeMobile = async (params, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const response = await API.apiService.post(
      '/api/mobile/payment/stripe',
      params,
      {
        headers,
      },
    );
    return response?.data;
  } catch (error) {
    console.log('ehrhkbeh', error.response);
  }
};

export const verifyPayment = async (params, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const url = '/api/mobile/payment/stripe/${params}';
    const response = await API.apiService.get(url, {
      headers,
    });
    return response?.data;
  } catch (error) {
    console.log({error});
  }
};

export const MakeCodOrder = async (params, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const response = await API.apiService.post(
      '/api/payment/cash-on-delivery',
      params,
      {
        headers,
      },
    );
    return response.data;
  } catch (error) {
    console.log({error});
  }
};

export const PaymentViaGooglePay = async (params, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const response = await API.apiService.post(
      '/api/mobile/payment/stripe/google',
      params,
      {
        headers,
      },
    );
    return response.data;
  } catch (error) {
    console.log({error});
  }
};

export const DeleteUserAccountService = async token => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const response = await API.apiService.get('/api/user/delete', {
      headers,
    });
    return response.data;
  } catch (error) {
    console.log({error});
  }
};
