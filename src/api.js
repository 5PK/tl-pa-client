import { API_ROOT } from "./api-config";

async function login(values) {

  console.log(API_ROOT);
  return fetch(`${API_ROOT}/Login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: values.email,
      password: values.password
    })
  });
}

async function getClient(jwt, cid) {
  fetch(`${API_ROOT}/client/` + cid, {
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
  return fetch(`${API_ROOT}/?clientId=` + cid, {
    method: "GET",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

export { getClients, addClient, getClient, getAlerts, login };
