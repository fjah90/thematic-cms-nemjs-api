const userPermissions = {
    admin: {
        GET: true,
        POST: true,
        PUT: true,
        DELETE: true
    },
    creator: {
        GET: true,
        POST: true,
        PUT: true,
        DELETE: false
    },
    reader: {
        GET: true,
        POST: false,
        PUT: false,
        DELETE: false
    },
};

module.exports = userPermissions;
