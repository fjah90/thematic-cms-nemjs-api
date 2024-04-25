const userPermissions = {
    admin: {
        get: true,
        post: true,
        put: true,
        delete: true
    },
    creator: {
        get: true,
        post: true,
        put: true,
        delete: false // Creator cannot delete
    },
    reader: {
        get: true,
        post: false,
        put: false,
        delete: false // Reader cannot post, put, or delete
    }
};

module.exports = userPermissions;
