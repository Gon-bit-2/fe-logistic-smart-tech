const loginData = { email: "gonjswork@gmail.com", password: "gonjs0710" };

fetch("http://localhost:8386/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(loginData)
})
  .then(r => r.json())
  .then(res => {
    if (!res.accessToken) return console.log("Login failed");
    return fetch("http://localhost:8386/vehicles?limit=100&page=1&type=VAN", {
      headers: { "Authorization": `Bearer ${res.accessToken}` }
    }).then(r => r.json())
      .then(d => console.log(d));
  });
