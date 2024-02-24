import axios from 'axios';
import handleError from '../common/handleError';
import config from '../config';

const client = axios.create({
  baseURL: config.baseURL,
  // TODO: some auth method for API Gateway
});

export const CreateEntry = async ({ namespace, entry }) => {
  try {
    await client.post(`namespace/${namespace}/entry`, entry);
    return true;
  } catch (e) {
    handleError(e.response);
    return false;
  }
};

export const GetEntryById = async ({ namespace, id }) => {
  try {
    const response = await client.get(`namespace/${namespace}/entry/${id}`);
    return response.data;
  } catch (e) {
    handleError(e.response);
    return null;
  }
};

export const GetRecentEntries = async ({ namespace }) => {
  try {
    const response = await client.get(`namespace/${namespace}/entries`);
    return response.data;
  } catch (e) {
    handleError(e.response);
    return [];
  }
};

export default {
  CreateEntry,
  GetEntryById,
  GetRecentEntries,
};
