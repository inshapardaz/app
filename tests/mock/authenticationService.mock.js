import {
  mockRequest, mockSlowRequest, mockRequestWithCode,
} from './mockHelpers';

// Example : new RegExp(/api\/account\/invitation\?(.*)$/);

const invitationPattern = new RegExp(/api\/accounts\/invitation\/(.*)$/);
const registerPattern = new RegExp(/api\/accounts\/register\/(.*)$/);
const authenticatePattern = new RegExp(/api\/accounts\/authenticate/);
const refreshTokenPattern = new RegExp(/api\/accounts\/refresh-token/);
const forgotPasswordPattern = new RegExp(/api\/accounts\/forgot-password/);
const resetPasswordPattern = new RegExp(/api\/accounts\/reset-password/);
const changePasswordPattern = new RegExp(/api\/accounts\/change-password/);
const revokeTokenPattern = new RegExp(/api\/accounts\/revoke-token/);

export default {
  mockLogin: (fixture) => {
    mockRequest(authenticatePattern, fixture, 'POST');
  },
  mockLoginSlow: (fixture) => {
    mockSlowRequest(authenticatePattern, fixture, 'POST');
  },
  mockLoginFailure: () => {
    mockRequestWithCode(authenticatePattern, 403, 'POST');
  },
  mockTokenRefreshAsAdmin: () => {
    mockRequest(refreshTokenPattern, 'account/admin-token.json', 'POST');
  },
  mockTokenRefresh: () => {
    mockRequest(refreshTokenPattern, 'account/token.json', 'POST');
  },
  mockVerifyInviteFailure: () => {
    mockRequestWithCode(invitationPattern, 404, 'GET');
  },
  mockVerifyInviteExpired: () => {
    mockRequestWithCode(invitationPattern, 410, 'GET');
  },
  mockVerifyInvite: () => {
    mockRequestWithCode(invitationPattern, 200, 'GET');
  },
  mockRegister: () => {
    mockRequestWithCode(registerPattern, 200, 'POST');
  },
  mockRegisterFailure: () => {
    mockRequestWithCode(registerPattern, 500, 'POST');
  },
  mockForgotPassword: () => {
    mockRequestWithCode(forgotPasswordPattern, 200, 'POST');
  },
  mockForgotPasswordFailure: () => {
    mockRequestWithCode(forgotPasswordPattern, 500, 'POST');
  },
  mockPasswordReset: () => {
    mockRequestWithCode(resetPasswordPattern, 200, 'POST');
  },
  mockPasswordResetFailure: () => {
    mockRequestWithCode(resetPasswordPattern, 500, 'POST');
  },
  mockChangePasswordReset: () => {
    mockRequestWithCode(changePasswordPattern, 200, 'POST');
  },
  mockChangePasswordResetFailure: () => {
    mockRequestWithCode(changePasswordPattern, 500, 'POST');
  },
  mockRevokeToken: () => {
    mockRequestWithCode(revokeTokenPattern, 200, 'POST');
  },
};
