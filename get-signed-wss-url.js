const AWS = require("aws-sdk");
const { Signer } = require("@aws-amplify/core");
const process = require("process");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const region = "eu-west-1";
const UserPoolId = "eu-west-1_0GLV9KO1p";
const IdentityPoolId = "eu-west-1:bce21571-e3a6-47a4-8032-fd015213405f";
const webSocketUrl = "wss://e4f3t7fs58.execute-api.eu-west-1.amazonaws.com/devbd";
//const webSocketUrl = wss://4rpyi2ae3f.execute-api.eu-west-1.amazonaws.com/prodbd/
const Logins = `cognito-idp.${region}.amazonaws.com/${UserPoolId}`;
const poolData = { UserPoolId, ClientId: "6timr8knllr4frovfvq8r2o6oo" };
const Pool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
AWS.config.region = region;

function getIdToken(Username, Password) {
  return new Promise((resolve, reject) => {
    const params = { Username, Password };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(params);
    var userData = { Username, Pool };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(result?.getIdToken()),
      onFailure: (err) => reject(err),
    });
  });
}

async function refreshCredsWithToken(idToken) {
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    clientConfig: { region },
    IdentityPoolId,
    Logins: { [Logins]: idToken },
  });
  await AWS.config.credentials.getPromise();
}

async function printSignedWssUrl(usernane, password) {
  const idToken = await getIdToken(usernane, password);
  await refreshCredsWithToken(idToken.getJwtToken());
  const params = {
    access_key: AWS.config.credentials.data.Credentials.AccessKeyId,
    secret_key: AWS.config.credentials.data.Credentials.SecretKey,
    session_token: AWS.config.credentials.data.Credentials.SessionToken,
  };
  const signedWsUrl = await Signer.signUrl(webSocketUrl, params);
  const username = idToken.decodePayload()["cognito:username"];
  console.log(JSON.stringify({ username, signedWsUrl }));
}

printSignedWssUrl(process.argv[2], process.argv[3]);
