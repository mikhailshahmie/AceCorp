////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
            if (userData.type == "passenger") {
                window.location.href = "/passenger-home.html";
            } else if (userData.type == "driver") {
                window.location.href = "/driver-home.html";
            }
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////