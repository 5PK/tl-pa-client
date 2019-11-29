import { BehaviorSubject } from 'rxjs';

import { login } from "./api-service"

const jwtSubject = new BehaviorSubject(localStorage.getItem('jwt'));




const auth_login = async (user) =>{
    
    const loginResponse = await login(user);
    const response = await loginResponse.json();
    console.log(loginResponse)
    console.log(response);
    if (response.statusCode === 200) {
        console.log("User Login Success");
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('jwt', response.data.token);
        jwtSubject.next(response.data.token);

        return true
    }else{
        alert("Login Failed!");
        return false
    }

}

function auth_logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('jwt');
    jwtSubject.next(null);
}
const authenticationService = {
    auth_login,
    auth_logout,
    jwt: jwtSubject.asObservable(),
    get jwtValue () { return jwtSubject.value }
};

export default authenticationService