const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

function votesToCsv(votes) {
  const csvWriter = createCsvWriter({
    header: [
      { id: 'id', title: 'ID' },
      { id: 'google_user_id', title: 'GoogleUserID' },
      { id: 'candidate_id', title: 'CandidateID' },
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'ip_address', title: 'IP' },
      { id: 'user_agent', title: 'UserAgent' },
      { id: 'browser', title: 'Browser' },
      { id: 'os', title: 'OS' },
      { id: 'device_type', title: 'DeviceType' },
      { id: 'country', title: 'Country' },
      { id: 'device_fingerprint', title: 'Fingerprint' },
    ],
  });
  return csvWriter.getHeaderString() + csvWriter.stringifyRecords(votes);
}

module.exports = votesToCsv;
