import axios from "axios";
import { getValueFor, save } from "../Service/SecureStore";

const ENDPOINT_URL = "https://api.blueaceindia.com/api/v1";
// const ENDPOINT_URL = "http://192.168.1.10:7987/api/v1";

const handleApiError = (error) => {
  console.error(error?.response?.data?.message || error.message);
  throw new Error(error?.response?.data?.message || error.message || "An error occurred during the request.");
};

export const login = async (form) => {
  console.log(form);
  try {
    const response = await axios.post(`${ENDPOINT_URL}/Login`, {
      Email: form?.email,
      Password: form?.password,
      ContactNumber: form?.phoneNumber
    });

    await save('token', response.data.token);
    return response.data.token;
  } catch (error) {
    return Promise.reject(error.response.data); 
  }
};


export const CheckToken = async () => {
  const token = await getValueFor('token');

  if (!token) throw new Error("Token not found.");

  try {
    const response = await axios.get(`${ENDPOINT_URL}/find_me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const GetAllServices = async () => {
  const token = await getValueFor('token');
  if (!token) throw new Error("Token not found.");

  try {
    const response = await axios.get(`${ENDPOINT_URL}/get-all-service-category`);
    return response?.data?.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

export const promotionalBanner = async () => {
  const token = await getValueFor('token');
  if (!token) throw new Error("Token not found.");

  try {
    const response = await axios.get(`${ENDPOINT_URL}/get-all-promotional-banner`);
    return response?.data?.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

export const ServiceByName = async (name) => {
  const token = await getValueFor('token');
  if (!token) throw new Error("Token not found.");

  try {
    const response = await axios.get(`${ENDPOINT_URL}/get-service-category-by-name/${name}`);
    return response?.data?.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAllServiceData = async (name) => {
  try {
    const response = await axios.get(`${ENDPOINT_URL}/get-all-service`);
    const allData = response?.data?.data || [];
    const regex = new RegExp(`^${name}$`, 'i');
    return allData.filter((item) => regex.test(item?.subCategoryId?.name));
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAddressSuggestions = async (query) => {
  try {
    const res = await axios.get(`${ENDPOINT_URL}/autocomplete?input=${encodeURIComponent(query)}`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchGeocode = async (selectedAddress) => {
  try {
    const res = await axios.get(`${ENDPOINT_URL}/geocode?address=${encodeURIComponent(selectedAddress)}`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getMyAllOrder = async ({ userId }) => {
  if (!userId) throw new Error("User Id is required.");

  try {
    const res = await axios.get(`${ENDPOINT_URL}/get-order-by-user-id?userId=${userId}`);
    const allData = res.data.data;
    return {
      allOrder: allData,
      activeOrder: allData.filter(item => !['Service Done', 'Cancelled'].includes(item.OrderStatus)),
      completeOrder: allData.filter(item => item.OrderStatus === 'Service Done'),
      CanceledOrder: allData.filter(item => item.OrderStatus === 'Cancelled'),
    };
  } catch (error) {
    handleApiError(error);
  }
};

export const handleBillStatusChange = async ({ status, billId }) => {
  try {
    const response = await axios.put(`${ENDPOINT_URL}/update-status-bills/${billId}`, { status });
    if (response.status === 200) {
      return "Bill approved successfully! Please Wait Our Vendor Call You Shortly";
    } else {
      throw new Error("Failed to update bill status.");
    }
  } catch (error) {
    handleApiError(error);
  }
};
