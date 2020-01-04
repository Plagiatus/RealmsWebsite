Realms Client API
=====================
Realms Control module for Node.JS


#### Main Class

```js
const Realms = require("minecraft-realms").Client;

var realms = new Realms("token:$ACCESS_TOKEN:$UUID","1.14.4","$NAME");
//Replace $ACCESS_TOKEN to you access token and $UUID and $NAME. From launcher profiles or Mojang Auth API.
//For more info see https://wiki.vg/Authentication

if (realms.availability == true){
    console.log("Realms available for this user");
}
```
