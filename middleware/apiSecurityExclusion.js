const excludeApiSecurityList = new Set(['/auth/login', '/auth/signup'])

const checkAuthRequired = (path) => {
    // Remove trailing slashes
    while (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }
    if(excludeApiSecurityList.has(path)){
        return false;
    }
    return true;
}

module.exports = {checkAuthRequired}