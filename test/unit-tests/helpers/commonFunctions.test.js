const sinon = require('sinon');
const should = require('should');
const {
    getIpAddressFromRequest,
    throwErrorIfEmpty,
    mapResourceToResponse,
    setMissingId,
} = require('../../../src/helpers/commonFunctions');
const cassandraClient = require('../../../src/helpers/cassandraClient');
const {
    INVALID_IP_ADDRESS,
    USER_ID_IS_MISSING,
    ADDRESS_ID_IS_MISSING
} = require('../../../src/helpers/globalVariables');

describe('Helpers- Common functions tests', () => {
    let sandbox, getUserByIdStub, getAddressByIdStub;

    before(() => {
        sandbox = sinon.createSandbox();
        getUserByIdStub = sandbox.stub(cassandraClient, 'getUserById');
        getAddressByIdStub = sandbox.stub(cassandraClient, 'getAddressById');
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    describe('Checking the throwErrorIfEmpty function', () => {

        describe('When the resource is not null', () => {
            it('Should not throw an error', () => {
                try {
                    throwErrorIfEmpty([1, 2, 3]);
                } catch (err) {
                    console.log('===>>>', err);
                    should(true).eql(false);
                }
            });
        });

        describe('When the resource is null', () => {
            it('Should throw an error', () => {
                let shouldCatch = false;

                try {
                    throwErrorIfEmpty(undefined);
                } catch (err) {
                    should(err.message).eql(USER_ID_IS_MISSING);
                    shouldCatch = true;
                }

                should(shouldCatch).eql(true);
            });
        });

        describe('When the resource length is zero', () => {
            it('Should throw an error', () => {
                let shouldCatch = false;

                try {
                    throwErrorIfEmpty([]);
                } catch (err) {
                    should(err.message).eql(USER_ID_IS_MISSING);
                    shouldCatch = true;
                }

                should(shouldCatch).eql(true);
            });
        });
    });

    describe('Checking the mapResourceToResponse function', () => {
        
        describe('When the resource has null keys', () => {
            it('Should delete any null keys in the resource', () => {
                const beforeResource = {
                    id: "0a758c46-f537-4296-9280-068d0d7b09ee",
                    created_date: "2019-02-18 15:22:10 +0000",
                    date_terms_accepted: "2019-02-18 15:22:10 +0000",
                    email_address: "test13@test.com",
                    first_name: "Testo",
                    last_name: "Test",
                    marketing_opt_in_accepted: false,
                    signup_ip_address: "127.255.255.255",
                    terms_accepted: true,
                    updated_date: "2019-02-18 15:22:10 +0000",
                    user_id_created: "0a758c46-f537-4296-9280-068d0d7b09ee",
                    user_id_updated: "0a758c46-f537-4296-9280-068d0d7b09ee",
                    additional_values: null
                };
                const afterResource = {
                    id: "0a758c46-f537-4296-9280-068d0d7b09ee",
                    created_date: "2019-02-18T15:22:10.000Z",
                    date_terms_accepted: "2019-02-18T15:22:10.000Z",
                    email_address: "test13@test.com",
                    first_name: "Testo",
                    last_name: "Test",
                    marketing_opt_in_accepted: false,
                    signup_ip_address: "127.255.255.255",
                    terms_accepted: true,
                    updated_date: "2019-02-18T15:22:10.000Z",
                    user_id_created: "0a758c46-f537-4296-9280-068d0d7b09ee",
                    user_id_updated: "0a758c46-f537-4296-9280-068d0d7b09ee"
                };

            const res = mapResourceToResponse(beforeResource);
            should(res).eql(afterResource);
            });
        });
    });

    describe('Checking the setMissinId function', () => {

        let shouldCatch, userId, addressId, userMock, addressMock;

        before(() => () => {
            userMock = { name: 'John Doe'};
            addressMock = { address_line_1: '5th Avenue 72, NY'};
            userId: 'fc1e2015-f408-465a-af97-6621a3754764';
            addressId: '08ed91c3-ce96-4c93-b75a-5a0c6eb8d13c';
        });

        describe('When the user ID is invalid', () => {
            it('Should return with the USER_ID_IS_MISSING error', async() => {
                getUserByIdStub.resolves(false);
                shouldCatch = false;

                try {
                    await setMissingId('invalid userId', addressId)
                } catch (err) {
                    shouldCatch = true;
                    should(getUserByIdStub.calledOnce).eql(true);
                    should(getAddressByIdStub.calledOnce).eql(false);
                    should(err.message).eql(USER_ID_IS_MISSING);
                }
                should(shouldCatch).eql(true);
            });
        });

        describe('When the user ID is valid but the address ID is invalid', () => {
            it('Should return with the ADDRESS_ID_IS_MISSING error', async () => {
                getUserByIdStub.resolves({ ...userMock });
                getAddressByIdStub.resolves(false);
                shouldCatch = false;

                try {
                    await setMissingId(userId, 'invalid addressID');
                } catch (err) {
                    shouldCatch = true;
                    should(getUserByIdStub.calledOnce).eql(true);
                    should(getAddressByIdStub.calledOnce).eql(true);
                    should(err.message).eql(ADDRESS_ID_IS_MISSING);
                }
                should(shouldCatch).eql(true);
            });
        });

        describe('When both user ID and address ID are valid', () => {
            it('Should not throw an error', async () => {
                getUserByIdStub.resolves({ ...userMock });
                getAddressByIdStub.resolves({ ...addressMock });
                shouldCatch = false;

                try { 
                    await setMissingId(userId, addressId);
                } catch (err) {
                    shouldCatch = true;
                }

                should(getUserByIdStub.calledOnce).eql(true);
                should(getAddressByIdStub.calledOnce).eql(true);
                should(shouldCatch).eql(false);
            });
        });
    });

    describe('Checking the getIpAddressFromRequest function', () => {
        
        const validIp = 'validIp';
        const invalidIp = false;

        describe('When there is no IP in the reqeust', () => {
            it('Should return with a INVALID_IP_ADDRESS error', () => {
                try {
                    getIpAddressFromRequest({params: 'no ip'}, invalidIp);
                } catch (err) {
                    should(err.msg).eql(`Ip address ${invalidIp} is invalid`);                 
                    shouldCatch = true;
                }
            });
        });

        describe('When the IP address is valid', () => {
            it('Should not throw an error', () => {
                
            });
        });
    });
    
});
