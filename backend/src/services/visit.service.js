const visitRepository = require('../repositories/visit.repository');

const getAllVisits = async () => {
  return visitRepository.findAllVisits();
};

const scheduleVisit = async (data) => {
  return visitRepository.createVisit(data);
};

module.exports = {
  getAllVisits,
  scheduleVisit
};
