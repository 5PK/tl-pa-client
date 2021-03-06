import { API_ROOT } from "./api-config";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";

async function login(values) {
  return fetch(`${API_ROOT}/login`, {
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

async function register(email, pass){
  return fetch(`${API_ROOT}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: pass
    })
  });
}

async function confirmCode(code){
  return fetch(`${API_ROOT}/register/confirm`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code: code
    })
  });
}

async function getClient(jwt, cid) {

  return fetch(`${API_ROOT}/client/` + cid, {
    method: "GET",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

async function deleteClient(jwt, cid){

  return fetch(`${API_ROOT}/client/` + cid, {
    method: "DELETE",
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

async function updateClient(jwt, client, cid) {
  return fetch(`${API_ROOT}/client/` + cid, {
    method: "PUT",
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
  return fetch(`${API_ROOT}/alert/?clientId=` + cid, {
    method: "GET",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

async function updateAlert(jwt, alert) {

  return fetch(`${API_ROOT}/alert/${alert.alertid}`, {
    method: "PUT",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: alert.name,
      query: alert.query,
      contacts: alert.contacts,
      clientId: alert.clientId
    })
  });
}

async function deleteAlert(jwt, aid){


  return fetch(`${API_ROOT}/alert/` + aid, {
    method: "DELETE",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

async function addAlert(jwt, alert, cid) {
  return fetch(`${API_ROOT}/alert`, {
    method: "POST",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: alert.name,
      query: alert.query,
      contacts: alert.contacts,
      clientId: alert.clientId
    })
  });
}

async function getContacts(jwt, cid) {
  return fetch(`${API_ROOT}/contact/?clientId=` + cid, {
    method: "GET",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

async function updateContact(jwt, contact) {

  return fetch(`${API_ROOT}/contact/` + contact.contactid, {
    method: "PUT",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email
    })
  });
}

async function deleteContact(jwt, cid){
  return fetch(`${API_ROOT}/contact/` + cid, {
    method: "DELETE",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

async function addContact(jwt, contact, clientId) {
  return fetch(`${API_ROOT}/contact/`, {
    method: "POST",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      firstName: contact.fname,
      lastName: contact.lname,
      email: contact.email,
      bx3ClientId: clientId
    })
  });
}

export { 
  getClients, 
  addClient, 
  getClient, 
  getAlerts, 
  updateAlert, 
  addAlert,
  login, 
  getContacts, 
  updateClient, 
  updateContact, 
  addContact,
  deleteClient,
  deleteAlert,
  deleteContact,
  register,
  confirmCode 
};
