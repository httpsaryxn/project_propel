import API from './api';

export const getMyOffers = async () => {
  const response = await API.get('/offers/my');
  return response.data;
};

export const respondToOffer = async (offerId, accepted) => {
  const response = await API.post('/offers/respond', { offer_id: offerId, accepted });
  return response.data;
};
