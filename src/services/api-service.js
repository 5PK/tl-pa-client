import { API_ROOT } from "./api-config";

async function login(values) {
  console.log(`${API_ROOT}/login`);
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

async function getClient(jwt, cid) {
  console.log(`${API_ROOT}/client/` + cid);

  return fetch(`${API_ROOT}/client/` + cid, {
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

  console.log(alert)

  return fetch(`${API_ROOT}/contact/` + alert.id, {
    method: "PUT",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      firstName: alert.firstName,
      lastName: alert.lastName,
      email: alert.email
    })
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

  console.log(contact)

  return fetch(`${API_ROOT}/contact/` + contact.id, {
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

async function addContact(jwt, contact, clientId) {
  console.log("hello?")
  return fetch(`${API_ROOT}/contact/`, {
    method: "POST",
    headers: {
      jwt: jwt,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      firstName: contact.firstName,
      lastName: contact.lastName,
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
  addContact };
