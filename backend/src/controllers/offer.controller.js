const offerService = require('../services/offer.service');
const { sendSuccess } = require('../utils/response');

const getMyOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getMyOffers(req.user.user_id);
    return sendSuccess(res, offers, 'My offers list');
  } catch (error) {
    next(error);
  }
};

const respondToOffer = async (req, res, next) => {
  try {
    const { offer_id, accepted } = req.body;
    const result = await offerService.respondToOffer(req.user.user_id, offer_id, accepted);
    return sendSuccess(res, result, `Offer ${accepted ? 'accepted' : 'declined'} successfully`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyOffers,
  respondToOffer
};
