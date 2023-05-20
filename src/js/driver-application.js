////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
            ////////////////
        });
    } else {
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////

const requestForm = document.querySelector("#requestForm");

requestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const test = requestForm.licenseImg.files;
    console.log(test[0].name);
    //${URL.createObjectURL(test[0])};
    console.log();
});
