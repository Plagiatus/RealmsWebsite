init();
function init() {
  let body = document.getElementsByTagName("body")[0];
  let data = {
    command: "getWorlds",
    email: "therealplagiatus@gmail.com",
    token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlOWM3YjlmYzNjNTU0MTg5ODlhZDZiZjcxNmVmNTk0YSIsIm5iZiI6MTU3NjIzNzAyNSwieWdndCI6ImU5ODkwN2FiYjFjMzQ3YjliMjczYTdjMDFiYjc2NDYyIiwic3ByIjoiZTc1ZTJkMjYzYjcyNGE5M2EzZTdhMjQ5MWY0YzQ1NGYiLCJyb2xlcyI6W10sImlzcyI6ImludGVybmFsLWF1dGhlbnRpY2F0aW9uIiwiZXhwIjoxNTc2NDA5ODI1LCJpYXQiOjE1NzYyMzcwMjV9.w3cNtWFSkqc_ApNvTbUZLzZw4CUgGh2vWNVEknyySoM",
    uuid: "e75e2d263b724a93a3e7a2491f4c454f",
    name: "Plagiatus"
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8100", false);
  xhr.send(JSON.stringify(data));
  if (!xhr.response) return;

  console.log(xhr.response);
  let servers = JSON.parse(xhr.response).servers;
  for (let s of servers) {
    let skin = "";
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://localhost:8100/skin?uuid=" + s.ownerUUID, false);
    xhr2.send();
    if (xhr2.response) {
      skin = JSON.parse(xhr2.response).skinurl;
    }
    let div = document.createElement("div");
    div.classList.add("headcontainer");
    div.innerHTML = `
    <div class='head headbase' style='background-image: url("${skin}");'></div>
    <div class='head headoverlay' style='background-image: url("${skin}");'></div>
    <p>${s.owner}</p>
    <p>${s.properties.name}</p>
    <p>${s.properties.description}</p>
    `;
    body.appendChild(div);
  }
}
