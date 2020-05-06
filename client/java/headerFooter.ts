namespace headerFooter {
  export let loadHeader: boolean = true;
  export let loadLoginHeader: boolean = false;
  export let loadFooter: boolean = true;
  window.addEventListener("load", header);
  window.addEventListener("load", footer);
  let div: HTMLDivElement = <HTMLDivElement>document.getElementById("RealmDisplayInHeader");
  // div.innerHTML = "TEST";
  function header() {
    if (!loadHeader) return;
    let pathnameRaw: string[] = window.location.pathname.split("/");
    let pathname: string = pathnameRaw[pathnameRaw.length - 1].includes(".html") || pathnameRaw[pathnameRaw.length - 1].length == 0 ? pathnameRaw[pathnameRaw.length - 2] : pathnameRaw[pathnameRaw.length - 1];
    let worldid = localStorage.getItem("worldid");
    let newBodyContent: string;
    if (loadLoginHeader) {
      newBodyContent = `
      <main>
      <header>
      <div style="height: 1px;"></div>
      <nav id="mainmenu">
      <ul>
      <li><img src="../img/icon.png" alt="" height="30px" style="padding: 0 5px">Realms Admin/Manager</li>
      <li class="floatRight"><a class="${pathname == "login" ? "activePage" : ""}" href="../login">Login</a></li>
      </ul>
        </nav>
        <div id="RealmDisplayInHeader">
        <!-- RealmName -->
        </div>
        </header>
        ${document.body.innerHTML}
        </main>
        `
    } else {
      newBodyContent = `
      <main>
        <header>
          <div style="height: 1px;"></div>
          <nav id="mainmenu">
            <ul>
              <li><img src="../img/icon.png" alt="" height="30px" style="padding: 0 5px"></li>
              <li><a class="${pathname == "realms" ? "activePage" : ""}" href="../realms">Realms</a></li>`;
      if (worldid) {
        newBodyContent += `
        <li><a class="${pathname == "overview" ? "activePage" : ""}" ${worldid ? 'href="../overview"' : ""}>Overview</a></li>
        <li><a class="${pathname == "players" ? "activePage" : ""}" ${worldid ? 'href="../players"' : ""}>Players</a></li>
        <li><a class="${pathname == "worlds" ? "activePage" : ""}" ${worldid ? 'href="../worlds"' : ""}>Worlds</a></li>
        <li><a class="${pathname == "settings" ? "activePage" : ""}" ${worldid ? 'href="../settings"' : ""}>Settings</a></li>`;
      }
      newBodyContent += `
            <li class="floatRight"> <a class="${pathname == "logout" ? "activePage" : ""}" href = "../logout" > Logout </a></li >
            </ul>
          </nav>
        <div id = "RealmDisplayInHeader" >
          <!--RealmName -->
        </div>
      </header>
      ${ document.body.innerHTML}
      </main>`;
    }
    document.body.innerHTML = newBodyContent;
  }
  function footer() {
    if (!loadFooter) return;
    let footer: string = `
    <footer>
      <hr>
      <div class="info">
        <span class="bold red">This is a beta version and currently under development.</span>
        There might still be bugs and errors. Please report them <a href="https://github.com/Plagiatus/RealmsWebsite/issues">on GitHub</a> or on <a href="https://discord.gg/upVpFQD">the Discord</a>.
      </div>
      <div class="links">
        <nav>
          <a href="https://github.com/Plagiatus/RealmsWebsite">Website-Code on Github</a> | 
          <a href="https://plagiatus.net/">Other things I do</a> | 
          <a href="https://plagiatus.net/impressum">Impressum</a> | 
          <a href="https://plagiatus.net/impressum">Data Protection Information</a> | 
          <a href="https://plagiatus.net/#contact">Contact</a> |
          <a href="../cookies">Cookie Settings</a> 
        </nav>
      </div>
      <div class="thanks">
        Thank you to <a href="https://crafatar.com">Crafatar</a> for providing the avatars.
      </div>
      <div class="copyright">
        © Lukas Scheuerle, 2020. All Rights Reserved.
        This page is not affiliated to or endorsed by Mojang or Microsoft. 
      </div>
    </footer>`;
    document.body.innerHTML += footer;
  }
}