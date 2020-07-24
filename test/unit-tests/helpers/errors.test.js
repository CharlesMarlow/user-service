const should = require('should');
const errors = require('../../../src/helpers/errors');
const { GENERAL_ERROR } = require = ('../../../src/helpers/globalVariables.js');
let expectedDefaultErrorCode = 500;
let expectedDefaultErrorMessage = 'Unexpected error occurred';

describe('Helpers- Errors tests', () => {
    
    describe('When the error is unknown', () => {
        it('Should return the default error', () => {
            let error = errors.getError('Unknown error');

            // Check for correct status code and error message
            should(error.code).eql(expectedDefaultErrorCode);
            should(error.message).eql(expectedDefaultErrorMessage);
        }); 
    });

    describe('When the error is of general error type', () => {
        it('Should return the general error details', () => {
            let error = errors.getError(GENERAL_ERROR);

            // Check for correct status code and error message
            should(error.code).eql(expectedDefaultErrorCode);
            should(error.message).eql(expectedDefaultErrorMessage);
        });
    });

    describe('When there is no error passed', () => {
        it('Should return the default error', () => {
            let error = errors.getError();

            // Check for correct status code and error message
            should(error.code).eql(expectedDefaultErrorCode);
            should(error.message).eql(expectedDefaultErrorMessage);
            should(error.more_info).eql(undefined);
        });
    });

    describe('When the error is of missing user ID type', () => {
        it('Should reutrn with the USER_ID_IS_MISSING error details', () => {
            let error = errors.getError('USER_ID_IS_MISSING');

            should(error.code).eql(404);
            should(error.message).eql('User ID not found')
        });
    });

    describe('When the error is of missing address ID type', () => {
        it('Should reutrn with the ADDRESS_ID_IS_MISSING error details', () => {
            let error = errors.getError('ADDRESS_ID_IS_MISSING');

            should(error.code).eql(404);
            should(error.message).eql('Address ID not found')
        });
    });

    describe('When the error is of email address already exists type', () => {
        it('Should reutrn with the EMAIL_ADDRESS_ALREADY_EXISTS error details', () => {
            let error = errors.getError('EMAIL_ADDRESS_ALREADY_EXISTS');

            should(error.code).eql(409);
            should(error.message).eql('Email address already exists in the system')
        });
    });
    
});