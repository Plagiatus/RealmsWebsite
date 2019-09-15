namespace RealmPage {
  export let realms: Realm[] = [];

  export async function initAllDisplays() {
    realms = await getOwnedRealms(player);
    console.log(realms);
    //@ts-ignore
    // realms.push({name: "Testrealm 2", motd:"nothing to see here"});
    initTabs();
    updatePlayerDisplay(realms[0].players);
  }

  function initTabs() {
    let tabs: HTMLElement = document.getElementById("RealmsList");
    tabs.innerHTML = "";

    let tab0: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("tab0")[0];
    let panels: HTMLDivElement = <HTMLDivElement>document.getElementById("ControlPanels");
    for (let i: number = 0; i < realms.length && i < 10; i++) {
      let label: HTMLLabelElement = document.createElement("label");
      label.setAttribute("for", "tab" + i);
      label.innerText = realms[i].name;
      tabs.appendChild(label);

      if(i>0){
        let tab: HTMLDivElement = <HTMLDivElement>tab0.cloneNode(true);
        tab.classList.remove("tab0");
        tab.classList.add("tab"+i);
        panels.appendChild(tab);
      }
    }
  }

  export function updateAllDisplays() {

  }
}