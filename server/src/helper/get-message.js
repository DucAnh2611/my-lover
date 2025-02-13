const messages = ["Vui lòng thử lại!"];

const getMessages = (qeuryResult) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

module.exports = getMessages;
