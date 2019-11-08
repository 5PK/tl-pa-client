import { API_ROOT } from './api-config';


async function getClient(jwt, cid){
    fetch("http://localhost:6969/client/" + cid, {
      method: "GET",
      headers: {
        jwt: jwt,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
}

async function getClients(jwt) {
    return fetch(`${API_ROOT}/client`, {
      method: "GET",
      headers: {
        jwt: jwt,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
}

async function addClient(jwt, client) {
    return fetch(`${API_ROOT}/client`, {
      method: "POST",
      headers: {
        jwt: jwt,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: client.name,
        aso: client.aso,
        primaryContact: client.primaryContact
      })
    });
}

async function getAlerts(jwt, cid) {
    return fetch("http://localhost:6969/alert/?clientId=" + cid, {
        method: "GET",
        headers: {
          jwt: jwt,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
}


export { getClients, addClient, getClient, getAlerts }