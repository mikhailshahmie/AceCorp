////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
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

const signoutbtn = document.querySelector("#signoutbtn");

signoutbtn.addEventListener("click", (e) => {
    main.signOut(main.auth)
        .then(() => {
            alert("Signing out...");
            window.location.href = "/index.html";
        })
        .catch((error) => {
            console.log(error.message);
        });
});
