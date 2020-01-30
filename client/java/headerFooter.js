var headerFooter;
(function (headerFooter) {
    headerFooter.loadHeader = true;
    headerFooter.loadLoginHeader = false;
    headerFooter.loadFooter = true;
    window.addEventListener("load", header);
    window.addEventListener("load", footer);
    let div = document.getElementById("RealmDisplayInHeader");
    // div.innerHTML = "TEST";
    function header() {
        if (!headerFooter.loadHeader)
            return;
        let pathnameRaw = window.location.pathname.split("/");
        let pathname = pathnameRaw[pathnameRaw.length - 1].includes(".html") || pathnameRaw[pathnameRaw.length - 1].length == 0 ? pathnameRaw[pathnameRaw.length - 2] : pathnameRaw[pathnameRaw.length - 1];
        let worldid = getCookie("worldid");
        let newBodyContent = headerFooter.loadLoginHeader ? `
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
    ` : `
    <main>
      <header>
        <div style="height: 1px;"></div>
        <nav id="mainmenu">
          <ul>
            <li><img src="../img/icon.png" alt="" height="30px" style="padding: 0 5px"></li>
            <li><a class="${pathname == "realms" ? "activePage" : ""}" href="../realms">Realms</a></li>
            <li><a class="${pathname == "overview" ? "activePage" : ""}${worldid ? "" : "disabled"}" ${worldid ? 'href="../overview"' : ""}>Overview</a></li>
            <li><a class="${pathname == "players" ? "activePage" : ""} ${worldid ? "" : "disabled"}" ${worldid ? 'href="../players"' : ""}>Players</a></li>
            <li><a class="${pathname == "worlds" ? "activePage" : ""} ${worldid ? "" : "disabled"}" ${worldid ? 'href="../worlds"' : ""}>Worlds</a></li>
            <li><a class="${pathname == "settings" ? "activePage" : ""} ${worldid ? "" : "disabled"}" ${worldid ? 'href="../settings"' : ""}>Settings</a></li>
            <li class="floatRight"><a class="${pathname == "logout" ? "activePage" : ""}" href="../logout">Logout</a></li>
          </ul>
        </nav>
        <div id="RealmDisplayInHeader">
          <!-- RealmName -->
        </div>
        </header>
        ${document.body.innerHTML}
      </main>`;
        document.body.innerHTML = newBodyContent;
    }
    function footer() {
        if (!headerFooter.loadFooter)
            return;
        let footer = `
    <footer>
      <hr>
      <div class="info">
        <span class="bold red">THIS IS AN UNSTABLE ALPHA VERSION and currently under development!</span>
        I know that everything currently is slow and unresponsive and ugly, I'm working on it, bit by bit.
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
})(headerFooter || (headerFooter = {}));
