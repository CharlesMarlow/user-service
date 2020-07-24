const sinon = require('sinon');
const should = require('should');
const httpMocks = require('node-mocks-http');
const notFound = require('../../../src/middlewares/notFound');
const logger = require('../../../src/helpers/logger');

describe('Middlewares- The notFound middleware', () => {

    let sandbox, req, res, nextStub, loggerInfoStub;

    before(() => {
        sandbox = sinon.createSandbox();
        nextStub = sandbox.stub();
        loggerInfoStub = sandbox.stub(logger, 'info');
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        req = httpMocks.createRequest();
        req.originalUrl = '/notExist';
        res = httpMocks.createResponse();
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    describe('When middleware is activated', () => {
        it('Should return a 404, write to log and call next', () => {
            notFound(req, res, nextStub);

            // Check for correct status code
            should(res.statusCode).eql(404);

            // Check for logger call and correct args
            should(loggerInfoStub.calledOnce).eql(true);
            should(loggerInfoStub.args[0][0]).eql(
              `Request to ${req.originalUrl} does not exist, 404 returned`  
            );

            // Check next function is called
            should(nextStub.calledOnce).eql(true);
        });
    })
});