var request = require('request');

// define access parameters
const COMPILER_ACCESS_TOKEN = '344b02a5da301f1099f1971de0be777c';
const COMPILER_ENDPOINT = 'b8ccbcdf.compilers.sphere-engine.com';
const PROBLEM_ACCESS_TOKEN = '61bec3b4efe56d8a0feb05e67f7c3c58';
const PROBLEM_ENDPOINT = 'b8ccbcdf.problems.sphere-engine.com';

const accessSphereEngine = async () => {
  return new Promise((resolve, reject) => {
    console.log('-------------ACCESS SPHERE ENGINE-------------')
    // send request
    request(
      {
        url: 'https://' + COMPILER_ENDPOINT + '/api/v4/test?access_token=' + COMPILER_ACCESS_TOKEN,
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
        url: 'https://' + COMPILER_ENDPOINT + '/api/v4/compilers?access_token=' + COMPILER_ACCESS_TOKEN,
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
        url: 'https://' + COMPILER_ENDPOINT + '/api/v4/submissions?access_token=' + COMPILER_ACCESS_TOKEN,
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
    var submissionsIds = [572060085];

    request({
      url: 'https://' + COMPILER_ENDPOINT + '/api/v4/submissions?ids=' + submissionsIds.join() + '&access_token=' + COMPILER_ACCESS_TOKEN,
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
      url: 'https://' + COMPILER_ENDPOINT + '/api/v4/submissions/' + 572060085 + '?access_token=' + COMPILER_ACCESS_TOKEN,
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
      url: 'https://' + COMPILER_ENDPOINT + '/api/v4/submissions/' + 572060085 + '/' + stream + '?access_token=' + COMPILER_ACCESS_TOKEN,
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

const getAllProblems = async () => {
  return new Promise((resolve, reject) => {
    console.log('-------------------GET PROBLEMS-------------------')
    // we can pass limit and offset in this api
    request({
      url: 'https://' + PROBLEM_ENDPOINT + '/api/v4/problems?limit=50&offset=0&access_token=' + PROBLEM_ACCESS_TOKEN,
      method: 'GET',
      form: {
        limit: 50,
        offset: 0
      }
    }, function (error, response, body) {

      if (error) {
        console.log('Connection problem');
      }
      // console.log(body)
      // process response
      if (response) {
        if (response.statusCode === 200) {
          // console.log(JSON.parse(response.body)); // list of problems in JSON
          resolve(JSON.parse(response.body))
        } else {
          if (response.statusCode === 401) {
            console.log('Invalid access token');
            reject(false);
          }
        }
      }
    });
  })
}

const createSampleProblem = async (id) => {
  return new Promise((resolve, reject) => {
    console.log('------------------CREATE SAMPLE PROGRAM----------------')
    // const problemDetails = {
    //   name: 'Sum of Odd Numbers',
    //   group: id,
    //   statement: {
    //     body: 'Write a program that calculates the sum of all odd numbers from 1 to N (inclusive).',
    //     input: 'The input consists of a single integer N (1 <= N <= 10^6), representing the upper limit.',
    //     output: 'Print the sum of all odd numbers from 1 to N on a single line.',
    //     constraints: '1 <= N <= 10^6',
    //     samples: [
    //       {
    //         input: '10',
    //         output: '25',
    //       },
    //       {
    //         input: '15',
    //         output: '64',
    //       },
    //     ],
    //   },
    //   solutions: [
    //     {
    //       language: 'c',
    //       code: `#include <stdio.h>

    // int main() {
    //   int N;
    //   scanf("%d", &N);

    //   int sum = 0;
    //   for (int i = 1; i <= N; i += 2) {
    //     sum += i;
    //   }

    //   printf("%d", sum);
    //   return 0;
    // }`,
    //     },
    //     // Other solutions for different languages
    //   ],
    // };

    const problemDetails = {
      masterjudgeId: id,
      name: 'Sum of Odd Numbers',
      body: 'Write a program that calculates the sum of all odd numbers from 1 to N (inclusive).'
    }

    const apiUrl = `https://${PROBLEM_ENDPOINT}/api/v4/problems`;

    const requestOptions = {
      url: apiUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PROBLEM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(problemDetails),
    };

    request(requestOptions, (error, response, body) => {
      if (error) {
        console.error('An error occurred while creating the problem:', error);
        reject(false);
        // return;
      }

      // Handle the response body as needed
      const createdProblem = JSON.parse(body);
      console.log('Problem created successfully:', createdProblem);
      resolve(createdProblem);
    });

  })
}

const createMasterJudge = async () => {
  return new Promise((resolve, reject) => {
    console.log('-----------------MASTER JUDGE-----------------');
    var judgeData = {
      compilerId: 11,
      compilerVersionId: 1,
      source: '<source_code>',
      typeId: 1,
      name: "MASTER JUDGE"
    };

    // send request
    request({
      url: 'https://' + PROBLEM_ENDPOINT + '/api/v4/judges?access_token=' + PROBLEM_ACCESS_TOKEN,
      method: 'POST',
      form: judgeData,
    }, function (error, response, body) {

      if (error) {
        console.log('Connection problem');
      }

      // process response
      if (response) {
        if (response.statusCode === 201) {
          console.log(JSON.parse(response.body)); // judge data in JSON
          const body = JSON.parse(response.body);
          resolve({
            data: body.id
          })
        } else {
          if (response.statusCode === 401) {
            console.log('Invalid access token');
            console.log(response.body, 'resp')
            reject(false);
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

const getProgram = async (problemId) => {
  return new Promise((resolve, reject) => {
    console.log('-----------------GET SPECIFIC PROBLEMS----------------')
    request({
      url: 'https://' + PROBLEM_ENDPOINT + '/api/v4/problems/' + problemId + '?access_token=' + PROBLEM_ACCESS_TOKEN,
      method: 'GET'
    }, function (error, response, body) {

      if (error) {
        console.log('Connection problem');
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          console.log(JSON.parse(response.body)); // problem data in JSON
          resolve(JSON.parse(response.body))
        } else {
          if (response.statusCode === 401) {
            console.log('Invalid access token');
            reject(false);
          } else if (response.statusCode === 403) {
            console.log('Access denied');
            reject(false);
          } else if (response.statusCode === 404) {
            console.log('Problem not found');
            reject(false);
          }
        }
      }
    })
  })
}

const createTestCase = async(problemId) => {
  return new Promise((resolve, reject) => {
    console.log('------------------CREATE TEST CASE------------------')
    var testcaseData = {
      input: 10,
      output: 25,
      timelimit: 5,
      judgeId: 1
  };
  
  // send request
  request({
      url: 'https://' + PROBLEM_ENDPOINT + '/api/v4/problems/' + problemId +  '/testcases?access_token=' + PROBLEM_ACCESS_TOKEN,
      method: 'POST',
      form: testcaseData
  }, function (error, response, body) {
      
      if (error) {
          console.log('Connection problem');
      }
      
      // process response
      if (response) {
          if (response.statusCode === 201) {
              console.log(JSON.parse(response.body)); // testcase data in JSON
              resolve(JSON.parse(response.body))
          }
          else {
              if (response.statusCode === 401) {
                  console.log('Invalid access token');
                  reject(false);
              } else if (response.statusCode === 403) {
                  console.log('Access denied');
                  reject(false);
              } else if (response.statusCode === 404) {
                  console.log('Problem does not exist');
                  reject(false);
              } else if (response.statusCode === 400) {
                  var body = JSON.parse(response.body);
                  console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message);
                  reject(false);
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
    const problems = await getAllProblems();
    const masterJudge = await createMasterJudge();
     console.log(masterJudge, 'nast')
    const problemCreated = await createSampleProblem(masterJudge.data);
     console.log(problems, 'prob')
    await getProgram(problemCreated.id);
    await createTestCase(problemCreated.id);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();

