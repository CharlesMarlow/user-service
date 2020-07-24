const sinon = require('sinon');
const should = require('should');
const httpMocks = require('node-mocks-http');
const healthController = require('../../../src/controllers/healthController');
const logger = require('../../../src/helpers/logger');

describe('Controllers- Health controller tests', () => {
    let sandbox, loggerTraceStub, req, res, nextStub;

    before(() => {
        sandbox = sinon.createSandbox();
        loggerTraceStub = sandbox.stub(logger, 'trace');
        nextStub = sandbox.stub();
    });

    beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    });

    after(() => {
        sandbox.restore();
    });

    describe('Checking the checkHealth function', () => {

        const healthMessage = 'OK';
        const healthHeader = {
            'content-type': 'application/json'
        }
       describe('When the service is healthy', () => {
           it('Should return with a successful response', async () => {   
            await healthController.checkHealth(req, res, nextStub);

               let resBody = JSON.parse(res._getData());
               let resHeaders = res._getHeaders();

               should(resBody.message).eql(healthMessage);
               should(resHeaders).eql(healthHeader);
           });
       });
    });
    
});