namespace headerFooter {
  export let loadHeader: boolean = true;
  export let loadFooter: boolean = true;
  window.addEventListener("load", header);
  window.addEventListener("load", footer);
  let div: HTMLDivElement = <HTMLDivElement>document.getElementById("RealmDisplayInHeader");
  // div.innerHTML = "TEST";
  function header() {
    if(!loadHeader) return;
    let worldid = getCookie("worldid");
    let newBodyContent: string = `
    <main>
      <header>
        <div style="height: 1px;"></div>
        <nav id="mainmenu">
          <ul>
            <li><a href="../realms">Realms</a></li>
            <li><a href="../overview">Overview</a></li>
            <li><a ${worldid ? 'href="../players"' : ""}>Players</a></li>
            <li><a ${worldid ? 'href="../worlds"' : ""}>Worlds</a></li>
            <li><a ${worldid ? 'href="../settings"' : ""}>Settings</a></li>
            <li><a href="../logout">Logout</a></li>
          </ul>
        </nav>
        <div id="RealmDisplayInHeader">
          <!-- RealmName -->
        </div>
        </header>
        ${document.body.innerHTML}
      </main>`
      ;
    document.body.innerHTML = newBodyContent;
  }
  function footer() {
    if(!loadFooter) return;
    let footer: string = `
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
          <a href="https://plagiatus.net/#contact">Contact</a>
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