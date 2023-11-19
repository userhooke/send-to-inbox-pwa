const API_URL = "https://264yww7hy3.execute-api.eu-west-1.amazonaws.com/prod/api";

async function call(method, endpoint, data = {}) {
  let url = API_URL;

  if (url.slice(-1) !== "/") {
    url = url.concat("/");
  }

  const response = await fetch(url + endpoint, {
    method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + localStorage.getItem("token"),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error(response.status + " " + response.statusText);
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

export const authenticate = (data) => call("POST", "authenticate", data)
export const sendMail = (data) => call("POST", "send", data)

