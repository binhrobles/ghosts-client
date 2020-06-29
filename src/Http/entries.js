import axios from 'axios';
import handleError from '../common/handleError';

export const CreateClient = (baseURL) => {
  return axios.create({
    baseURL,
    // TODO: some auth method for API Gateway
  });
};

export const CreateEntry = async ({ client, namespace, entry }) => {
  try {
    await client.post(`namespace/${namespace}/entry`, entry);
  } catch (e) {
    handleError(e);
  }
};

export const GetRecentEntries = async ({ client, namespace }) => {
  try {
    const response = await client.get(`namespace/${namespace}/entries`);
    return response.data;
  } catch (e) {
    handleError(e);
    return [];
  }
};
