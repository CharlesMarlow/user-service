const sinon = require('sinon');
const should = require('should');
const bunyan = require('bunyan');
const logger = require('../../../src/helpers/logger.js');

describe('Helpers- The logger tests', () => {
    let sandbox, loggerTraceStub, loggerInfoStub,
    loggerErrorStub, context;

    describe('The customLogger function', () => {

        before(() => {
            sandbox = sinon.createSandbox();
            loggerTraceStub = sandbox.stub(bunyan.prototype, 'trace');
            loggerInfoStub = sandbox.stub(bunyan.prototype, 'info');
            loggerErrorStub = sandbox.stub(bunyan.prototype, 'error');
            context = {
                userId: 'company-user-id',
                requestId: 'company-request-id',
                orderId: '6134f56e-637c-46c7-a44f-effb81326999'
            };
        });

        afterEach(() => {
            sandbox.reset();
        });

        after(() => {
            sandbox.restore();
        });

        describe('When calling logger.trace', () => {
            it('Should pass the arguments as is to bunyan', () => {

                logger.trace('arg1', 'arg2');

                // check logger.trace is called with correct args
                should(loggerTraceStub.calledOnce).eql(true);
                should(loggerTraceStub.args[0][0]).eql('arg1');
            });
        });

        describe('When logger.info was called with a STRING instead of an object', () => {
            it('Should call bunyan with the correct arguments', () => {
                logger.info('I am a string - not an object');

                // check logger.info is called with correct args
                should(loggerInfoStub.calledOnce).eql(true);
                should(loggerInfoStub.args[0].length).eql(1);
                should(loggerInfoStub.args[0]).eql(['I am a string - not an object']);
            });
        });

        describe('When logger.error was called with a STRING instead of an object', () => {
            it('Should call bunyan with the correct arguments', () => {
                logger.error('I am a string - not an object');

                // check logger.error is called with correct args
                should(loggerErrorStub.calledOnce).eql(true);
                should(loggerErrorStub.args[0].length).eql(1);
                should(loggerErrorStub.args[0]).eql(['I am a string - not an object']);
            });
        });

        describe('When logger.info was called only with a message argument', () => {
            it('Should call bunyan with the correct arguments', () => {
                logger.info({ message: 'Info called with message only' });

                // check logger.info is called with correct args & has correct args.length
                should(loggerInfoStub.calledOnce).eql(true);
                should(loggerInfoStub.args[0].length).eql(1);
                should(loggerInfoStub.args[0][0]).eql('Info called with message only');
            });
        });

        describe('When logger.info was called with a full object argument', () => {
            it('Should call bunyan with the correct arguments', () => {
                logger.info({ message: 'Info called with a full object', context});

                // check logger.info is called with correct args & has correct args.length
                should(loggerInfoStub.calledOnce).eql(true);
                should(loggerInfoStub.args[0].length).eql(2);
                should(loggerInfoStub.args[0][0]).eql({ ...context });
                should(loggerInfoStub.args[0][1]).eql('Info called with a full object');
            });
        });

        describe('When logger.error was called with an object WITHOUT a message argument', () => {
            it('Should call bunyan with the correct arguments', () => {
                let err = new Error('my key is not called message');
                logger.error({ err, context });

                // check logger.error is called with correct args & has correct args.length
                should(loggerErrorStub.calledOnce).eql(true);
                should(loggerErrorStub.args[0].length).eql(2);
                loggerErrorStub.args[0][0].should.have.property('stack');
            });
        });

        describe('When logger.error is called with a message only', () => {
            it('Should call bunyan with the correct arguments', () => {
                logger.error({ message: 'Error was called with a message arg only' });

                // check logger.error is called with correct args & has correct args.length
                should(loggerErrorStub.calledOnce).eql(true);
                should(loggerErrorStub.args[0].length).eql(1);
                should(loggerErrorStub.args[0][0]).eql('Error was called with a message arg only');
            });
        });

        describe('When logger.error is called with an object without a message key', () => {
            it('Should call bunyan with the correct arguments', () => {
                let err = { 'this is the error': 'hey' };

                logger.error({
                    message: 'Error was called with a full object',
                    err,
                    context
                });

                // check logger.error is called with correct args & has correct args.length
                should(loggerErrorStub.calledOnce).eql(true);
                should(loggerErrorStub.args[0].length).eql(2);
                should(loggerErrorStub.args[0][0]).eql({
                    userId: 'company-user-id',
                    requestId: 'company-request-id',
                    orderId: '6134f56e-637c-46c7-a44f-effb81326999',
                    err,
                    stack: undefined
                });
                should(loggerErrorStub.args[0][1]).eql(
                    'Error was called with a full object'
                );
            });
        });

        describe('When logger.error is called with an object with a message but without a stack key', () => {
            it('Should call bunyan with the correct arguments', () => {
                let err = { message: 'the error message' };
                logger.error({
                    message: 'Error was called with a full object',
                    err,
                    context
                });

                // check logger.info is called with correct args & has correct args.length
                should(loggerErrorStub.calledOnce).eql(true);
                should(loggerErrorStub.args[0].length).eql(2);
                should(loggerErrorStub.args[0][0]).eql({
                    userId: 'company-user-id',
                    requestId: 'company-request-id',
                    orderId: '6134f56e-637c-46c7-a44f-effb81326999',
                    err: err.message,
                    stack: undefined
                });
                should(loggerErrorStub.args[0][1]).eql(
                    'Error was called with a full object'
                );
            });
        });
        
    });
});
