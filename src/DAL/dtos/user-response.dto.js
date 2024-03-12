export default class UsersResponse {
    constructor(user) {
      this.name = `${user.first_name} ${user.last_name}`;
      this.email = user.email;
      this.role = user.role;
      this.last_connection = user.last_connection;
    }

    static fromModel(user) {
      return new UsersResponse(user);
    }
  }