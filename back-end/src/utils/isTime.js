function isTime(string) {
    const regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
    return regexp.test(string);
}

module.exports = isTime;