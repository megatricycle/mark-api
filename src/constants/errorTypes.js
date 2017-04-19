export const forbidden = {
    status: 403,
    message: 'FORBIDDEN'
};

export const missingFields = result => {
    return {
        status: 422,
        message: 'MISSING_FIELDS',
        fields: result
    };
};

export const validationError = result => {
    return {
        status: 422,
        message: 'VALIDATION_ERROR',
        fields: result.array()
    };
};

export const invalidCredentials = info => {
    return {
        status: 401,
        message: info
    };
};

export const resourceNotFound = {
    status: 404,
    message: 'RESOURCE_NOT_FOUND'
};

export const noUserFound = userId => {
    return {
        status: 404,
        message: 'NO_USER_FOUND',
        userId
    };
};
