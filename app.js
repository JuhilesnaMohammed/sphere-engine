var request = require('request');

// define access parameters
const ACCESS_TOKEN = '344b02a5da301f1099f1971de0be777c';
const ENDPOINT = 'b8ccbcdf.compilers.sphere-engine.com';

const accessSphereEngine = async () => {
  return new Promise((resolve, reject) => {
    console.log('-------------ACCESS SPHERE ENGINE-------------')
    // send request
    request(
      {
        url: 'https://' + ENDPOINT + '/api/v4/test?access_token=' + ACCESS_TOKEN,
        method: 'GET',
      },
      function (error, response, body) {
        if (error) {
          console.log('Connection problem');
          reject(error);
          return;
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            const result = JSON.parse(response.body); // test message in JSON
            console.log(result);
            resolve(result);
          } else {
            if (response.statusCode === 401) {
              console.log('Invalid access token');
              reject('Invalid access token');
            }
          }
        }
      }
    );
  });
};

const getCompilers = async () => {
  return new Promise((resolve, reject) => {
    console.log('-------------GET COMPILERS-------------')
    request(
      {
        url: 'https://' + ENDPOINT + '/api/v4/compilers?access_token=' + ACCESS_TOKEN,
        method: 'GET',
      },
      function (error, response, body) {
        if (error) {
          console.log('Connection problem');
          reject(error);
          return;
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            const result = JSON.parse(response.body); // list of compilers in JSON
            console.log(result);
            resolve(result);
          } else {
            if (response.statusCode === 401) {
              console.log('Invalid access token');
              reject('Invalid access token');
            }
          }
        }
      }
    );
  });
};

const submitProgram = async (req) => {
  return new Promise((resolve, reject) => {
    console.log('-------------SUBMIT PROGRAM-------------')
    var submissionData = {
      compilerId: req.compiler_id,
      source: req.source_code
    };

    request(
      {
        url: 'https://' + ENDPOINT + '/api/v4/submissions?access_token=' + ACCESS_TOKEN,
        method: 'POST',
        form: submissionData
      },
      function (error, response, body) {
        if (error) {
          console.log('Connection problem');
          reject(error);
        }

        // process response
        if (response) {
          if (response.statusCode === 201) {
            console.log(JSON.parse(response.body)); // submission data in JSON
            resolve(response.body);
          } else {
            if (response.statusCode === 401) {
              console.log('Invalid access token');
              reject('Invalid access token');
            } else if (response.statusCode === 402) {
              console.log('Unable to create submission');
              reject('Unable to create submission');
            } else if (response.statusCode === 400) {
              var body = JSON.parse(response.body);
              console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message);
              reject(body.message);
            }
          }
        }
      }
    );
  });
};

const viewSubmissionOfMultipleIds = async (req) => {
  return new Promise((resolve, reject) => {
    console.log('-------------VIEW SUBMISSION OF MULTIPLE PROGRAM IDS-------------')
    console.log(req, 're q')
    var submissionsIds = req;

    request({
      url: 'https://' + ENDPOINT + '/api/v4/submissions?ids=' + submissionsIds.join() + '&access_token=' + ACCESS_TOKEN,
      method: 'GET'
    }, function (error, response, body) {

      if (error) {
        console.log('Connection problem');
        reject('Connection problem')
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          console.log(JSON.parse(response.body)); // list of submissions in JSON
          resolve(JSON.parse(response.body))
        } else {
          if (response.statusCode === 401) {
            console.log('Invalid access token');
            reject('Invalid access token')
          } else if (response.statusCode === 400) {
            var body = JSON.parse(response.body);
            console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
            reject('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
          }
        }
      }
    });
  })
}

const viewSubmissionOfSingleProgram = (id) => {
  return new Promise((resolve, reject) => {
    console.log('-------------VIEW SUBMISSION OF SINGLE PROGRAM IDS-------------')
    request({
      url: 'https://' + ENDPOINT + '/api/v4/submissions/' + id + '?access_token=' + ACCESS_TOKEN,
      method: 'GET'
    }, function (error, response, body) {

      if (error) {
        console.log('Connection problem');
        reject('Connection problem')
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          console.log(JSON.parse(response.body)); // submission data in JSON
          resolve(JSON.parse(response.body))
        } else {
          if (response.statusCode === 401) {
            console.log('Invalid access token');
            reject('Invalid access token')
          }
          if (response.statusCode === 403) {
            console.log('Access denied');
            reject('Access denied');
          }
          if (response.statusCode === 404) {
            console.log('Submission not found');
            reject('Submission not found')
          }
        }
      }
    });
  })
}

const getSubmissionInStream = async (id) => {
  return new Promise((resolve, reject) => {
    console.log('-------------GET SUBMISSION IN STREAM-------------')
    console.log(id)
    const stream = 'source' // enum source, input, output, error or cmpinfo
    request({
      url: 'https://' + ENDPOINT + '/api/v4/submissions/' + 572037722 + '/' + stream + '?access_token=' + ACCESS_TOKEN,
      method: 'GET'
    }, function (error, response, body) {

      if (error) {
        console.log('Connection problem');
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          console.log(response.body); // raw data from selected stream
          resolve(response.body);
        } else {
          if (response.statusCode === 401) {
            console.log('Invalid access token');
            reject('Invalid access token')
          } else if (response.statusCode === 403) {
            console.log('Access denied');
            reject('Access denied')
          } else if (response.statusCode === 404) {
            var body = JSON.parse(response.body);
            console.log('Non existing resource, error code: ' + body.error_code + ', details available in the message: ' + body.message)
            reject('Non existing resource, error code: ' + body.error_code + ', details available in the message: ' + body.message);
          } else if (response.statusCode === 400) {
            var body = JSON.parse(response.body);
            console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
            reject('Error code: ' + body.error_code + ', details available in the message: ' + body.message);
          }
        }
      }
    });
  })
}

(async () => {
  try {
    await accessSphereEngine();
    await getCompilers();
    const submitResp = JSON.parse(await submitProgram({
      compiler_id: 1,
      source_code: `#include <iostream>
      int main() {
        std::cout << "Hello, Sphere Engine!" << std::endl;
        return 0;
      }`
    }));
    console.log(submitResp, 'submitresp');

    await viewSubmissionOfMultipleIds([submitResp.id]);
    await viewSubmissionOfSingleProgram(submitResp.id);
    await getSubmissionInStream(submitResp.id);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();

