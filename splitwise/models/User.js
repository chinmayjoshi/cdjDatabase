class User {

    constructor(userId, name, email, password) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    toString() {
        console.log("method called");
    }

}
export default User;
