let users = [];

const userJoin = (id, username, room) => {

    const user = {
        id, 
        username, 
        room
    };
    users.push(user)

    return user;

}

// Get the current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

// user leaves the chat
const removeUser = (id) => {
    // const userIndex = users.findIndex(user => user.id === id);
    // console.log(userIndex);
    // if (userIndex !== -1){
    //     users = users.splice(userIndex, 1)
    //     return users[0]
    // }    
    users = users.filter(user => user.id !== id);
    return users
}

// Get Room Users
const getRoomUsers = (room) => {
    const roomUsers = users.filter(user => user.room === room);
    return roomUsers;
}

module.exports = {
    userJoin,
    getCurrentUser,
    removeUser,
    getRoomUsers
}
 


         