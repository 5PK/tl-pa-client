import Cookies from "js-cookie";

class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(callback) {
    this.authenticated = true;
    callback();
  }

  logout(callback) {
    this.authenticated = false;
    callback();
  }

  setJwt(jwt) {
    Cookies.set("jwt", jwt);
  }

  getJwt() {
    var jwt = Cookies.get("jwt");
    return jwt;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
