////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
        if (emailRegEx.test(user.email)) {
            main.signOut(main.auth)
                .then(() => {
                    alert("Logging out...");
                    window.location.href = "/loginadmin.html";
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
        main.getDoc(main.doc(main.db, "admins", user.displayName)).then((doc) => {
            userData = doc.data();
            const email = document.querySelector("#email");
            const username = document.querySelector("#username");

            email.textContent = userData.email;
            username.textContent = user.displayName;
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////
