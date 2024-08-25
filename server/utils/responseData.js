function responseForInternalServerError() {
    this.code = 500;
    this.status = 'failure';
    this.message = 'Internal Server Error'
}

function responseForPayloadIncorrectError() {
    this.code = 400;
    this.status = 'failure';
    this.message = 'Payload is not correct. It is missing one or more required info'
}

function responseForObjectNotFound() {
    this.code = 200;
    this.status = 'not_found';
    this.message = 'Queried object does not exist'
}

function responseForSuccessMessage() {
    this.code = 200;
    this.status = 'success';
}

function responseForGenericFailureError() {
    this.code = 400;
    this.status = 'failure';
}

function responseForUnauthorisedUserError() {
    this.code = 401;
    this.message = 'User is not authorised with given credential'
    this.status = 'unauthorised';
}

function alreadyLikedErrorMessage() {
    this.code = 200;
    this.message = 'User already liked';
    this.status = 'already_liked'
}

function alreadyDislikedErrorMessage() {
    this.code = 200;
    this.message = 'User already disliked';
    this.status = 'already_disliked'
}

function alreadyDeletedErrorMessage() {
    this.code = 200;
    this.message = 'User already deleted';
    this.status = 'already_deleted'
}

module.exports = {
    serverError: responseForInternalServerError,
    payloadError: responseForPayloadIncorrectError,
    notFoundError: responseForObjectNotFound,
    successMessage: responseForSuccessMessage,
    genericFailureError: responseForGenericFailureError,
    unauthorisedUserResponse: responseForUnauthorisedUserError,
    alreadyLikedErrorMessage: alreadyLikedErrorMessage,
    alreadyDislikedErrorMessage: alreadyDislikedErrorMessage,
    alreadyDeletedErrorMessage: alreadyDeletedErrorMessage,
    customLabels : {
        totalDocs: 'total',
        docs: 'data',
        limit: 'limit',
        page: 'page',
        totalPages: 'pages'
    }
}
