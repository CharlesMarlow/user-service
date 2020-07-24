const sinon = require('sinon');
const should = require('should');
const httpMocks = require('node-mocks-http');
const { userId, addressId } = require('../../mocks/mockObjects');
const contextExtractor = require('../../../src/middlewares/contextExtractor');
const {
    COMPANY_USER_ID, COMPANY_REQUEST_ID
} = require = ('../../../src/helpers/globalVariables.js');

describe('Middlewares- The context extractor middleware', () => {
    let sandbox, req, res, nextStub;

    before(() => {
        sandbox = sinon.createSandbox();
        nextStub = sandbox.stub();
    });

    after(() => {
        sandbox.restore();
    });

    describe('Functionality tests', () => {

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
        });

        afterEach(() => {
            sandbox.resetHistory();
        });

        describe('When all params are sent with the request', () => {
            it('Should return the ctx object all correct values', () => {
                req.headers = {
                  [COMPANY_REQUEST_ID]: 'x-comapny-request-id',
                  [COMPANY_USER_ID]: 'x-company-user-id',
                };

                req.params = {
                    userId,
                    addressId,
                };

                contextExtractor(req, res, nextStub);

                // Check next is called and has no args
                should(nextStub.calledOnce).eql(true);
                should(nextStub.args[0]).eql([]);

                console.log('===>>>', req.ctx);
                // Check ctx object
                should(req.ctx).eql({
                  companyUserId: req.headers.companyUserId,
                  companyRequestId: req.headers.companyRequestId,
                  userId: req.params.userId,
                  addressId: req.params.addressId,
                });
            });
        });
    });
});