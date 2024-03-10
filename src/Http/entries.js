import axios from 'axios';
import { handleError } from '../common/utils';
import config from '../config';

const client = axios.create({
  baseURL: config.baseURL,
  // TODO: some auth method for API Gateway
});

export const CreateEntry = async ({ entry }) => {
  try {
    await client.post(`namespace/public/entry`, entry);
    return true;
  } catch (e) {
    handleError(e.response);
    return false;
  }
};

export const GetEntryById = async ({ id }) => {
  try {
    const response = await client.get(`namespace/public/entry/${id}`);
    return response.data;
  } catch (e) {
    handleError(e.response);
    return null;
  }
};

export const GetEntries = async () => {
  try {
    const response = await axios.get(config.entriesIndexURL);
    return response.data;
  } catch (e) {
    handleError(e.response);
    return [];
  }
};

export default {
  CreateEntry,
  GetEntryById,
  GetEntries,
};
