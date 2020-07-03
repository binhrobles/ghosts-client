import { createContext } from 'react';
import axios from 'axios';
import handleError from '../common/handleError';

export const EntriesClientContext = createContext();

export const CreateClient = (baseURL) => {
  return axios.create({
    baseURL,
    // TODO: some auth method for API Gateway
  });
};

export const CreateEntry = async ({ client, namespace, entry }) => {
  try {
    await client.post(`namespace/${namespace}/entry`, entry);
    return true;
  } catch (e) {
    handleError(e.response);
    return false;
  }
};

export const GetEntryById = async ({ client, namespace, id }) => {
  try {
    const response = await client.get(`namespace/${namespace}/entry/${id}`);
    return response.data;
  } catch (e) {
    handleError(e.response);
    return null;
  }
};

export const GetRecentEntries = async ({ client, namespace }) => {
  try {
    const response = await client.get(`namespace/${namespace}/entries`);
    return response.data;
  } catch (e) {
    handleError(e.response);
    return [];
  }
};
