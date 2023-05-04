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

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", (e) => {
    console.log(userData);
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    main.signInWithEmailAndPassword(main.auth, email, password)
        .then((cred) => {
            alert(cred.user.email);
            console.log(main.auth.currentUser);
        })
        .catch((error) => {
            alert(error.message);
        });
});
