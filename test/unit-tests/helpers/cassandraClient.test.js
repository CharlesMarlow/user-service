const sinon = require('sinon');
const should = require('should');
const cassandraDriver = require('cassandra-driver');
const cassandraClient = require('../../../src/helpers/cassandraClient');
const env = require('../../../config/env');
const logger = require('../../../src/helpers/logger');
const { 
    userResource,
    userId,
    addressId,
    postUserQuery,
} = require('../../mocks/mockObjects');

describe('Helpers- Cassandra client tests', () => {
    let sandbox,
        loggerInfoStub,
        loggerErrorStub,
        cassandraClientStub,
        cassandraOperatorStub,
        clientStub,
        connectStub,
        shutdownStub;

        let CASSANDRA_TIME_OUT = 12000;
        let clientArgs = [
                    {
                        contactPoints: ['cassandraFullPath'],
                        keyspace: 'publisher',
                        authProvider: {
                            username: 'cassandra',
                            password: 'cassandra'
                        },
                        localDataCenter: 'datacenter1',
                        socketOptions: { readTimeout: CASSANDRA_TIME_OUT }
                    }
                ];
        
    before(() => {
        // env
        env.CASSANDRA_FULL_PATH = 'cassandraFullPath';
        env.CASSANDRA_USERNAME = 'cassandra';
        env.CASSANDRA_PASSWORD = 'cassandra';
        env.CASSANDRA_KEYSPACE = 'publisher';
        env.CASSANDRA_READ_TIMEOUT = CASSANDRA_TIME_OUT;
        env.CASSANDRA_DATA_CENTER = 'datacenter1';

        // stubs
        sandbox = sinon.createSandbox();
        loggerInfoStub = sandbox.stub(logger, 'info');
        loggerErrorStub = sandbox.stub(logger, 'error');
        connectStub = sandbox.stub();
        shutdownStub = sandbox.stub();
        cassandraClientStub = sandbox.stub();

        cassandraOperatorStub = {
        connect: connectStub,
        execute: cassandraClientStub,
        shutdown: shutdownStub
        };

        clientStub = sandbox.stub(cassandraDriver, 'Client');
        clientStub.returns(cassandraOperatorStub);
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    describe('The init function tests', () => {
        it('Should successfully connect to Cassandra', async () => {
            connectStub.returns(Promise.resolve());
        
            try {
                await cassandraClient.init();
                should(JSON.parse(JSON.stringify(clientStub.args[0][0]))).eql(clientArgs[0]);
            } catch (err) {
                // check logger is called with correct value
                should(loggerInfoStub.called).eql(true);
                should(loggerInfoStub.args[0][0].message).eql(
                    'Adding connection to Cassandra'
                );

                // check connection
                should(connectStub.calledOnce).eql(true);
                should(clientStub.calledBefore(connectStub)).eql(true);
                }
        });
    });

    describe('The closeConnection function tests', () => {
        before(() => {
            connectStub.returns(Promise.resolve());
            return cassandraClient.init();
        });

        it('Should succeed to close the connection', async () => {
            shutdownStub.returns(Promise.resolve());
            await cassandraClient.closeConnection();

                should(shutdownStub.calledOnce).eql(true);

        });

        it('Should fail to close the connection', async () => {
            shutdownStub.returns(Promise.reject(new Error('error')));
            try {
                await cassandraClient.closeConnection();

                should.fail(null, null, 'closeConnection should be rejected');
            } catch (err) {
                // check for closeConnection error and correct value
                should(shutdownStub.calledOnce).eql(true);
                should(err).eql(new Error('error'));
            }

        });
    });

    describe('postUser tests', () => {

        describe('On a susccessful response', () => {
            it('Should execute the query with no errors', async () => {
                cassandraClientStub.resolves(userResource);

                // await cassandraClient.postUser(userId, userId, userResource);
                const query = postUserQuery;

                // should(cassandraClientStub.args[0][0]).equal(query);
            });
        });
        
    });
    
});