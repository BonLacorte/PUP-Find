export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
    (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
    return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
    if (users && users.length >= 2) {
        return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
    }
    return '';
};

export const getSenderUid = (loggedUser, users) => {
    if (users && users.length >= 2) {
        return users[0]?._id === loggedUser?._id ? users[1].uid : users[0].uid;
    }
    return '';
}

export const getSenderAvatar = (loggedUser, users) => {
    if (users && users.length >= 2) {
        const senderId = users[0]?._id === loggedUser?._id ? users[1].pic.url : users[0].pic.url;
        // console.log(`senderId - `,senderId)
        return senderId
    }
    return '';
};

export const getSenderFull = (loggedUser, users) => {
    if (users && users.length >= 2) {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    return '';
};


export const latestMessage = (loggedUser, chat, userId) => {
    // console.log(`CHATTTTT`, chat)
    
    if (chat.latestMessage === null || chat.latestMessage === undefined) {
        // console.log(`chat lastMessage null`, chat)
        return false
    } else {
        const matchedUser = chat.lastSeenMessage.filter((user) => {
            return user.user === userId
        })
        // console.log(`chat lastMessage not null`, chat)
        // console.log(`value of matchedUser`, matchedUser)
        if(matchedUser.length > 0) {
            // console.log(`matchedUser.message is not null`, matchedUser.message)
            return (matchedUser[0].message).toString() ===  (chat.latestMessage._id).toString()
        } else {
            // console.log(`matchedUser.message is null`)
            return false
        }
        
        // console.log(`value of matchedUser`, matchedUser)
        // console.log(`matchedUser.message is null`)

    }
}
