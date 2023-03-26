const User = require('./user');




class UserGroup  {
 users = [];
 groupId = null;
 name = null;


constructor(users, groupId,name) {
    this.users = users;
    this.groupId = groupId;
    this.name = name;
}

get users() {
    return this.users;
};

get groupId() {
    return this.groupId;
};

toString() {  
    console.log("method called") ;
}




}