const offerRepository = require('../repositories/offer.repository');
const studentRepository = require('../repositories/student.repository');

const getMyOffers = async (userId) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return offerRepository.getMyOffers(student.student_id);
};

const respondToOffer = async (userId, offerId, accepted) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return offerRepository.respondToOffer(offerId, student.student_id, accepted);
};

module.exports = {
  getMyOffers,
  respondToOffer
};
