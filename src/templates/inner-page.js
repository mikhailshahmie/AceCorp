////////////////////////////MUST HAVE////////////////////////////
const main = require("../js/main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////
