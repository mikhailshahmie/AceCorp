////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();

            if (user.emailVerified) {
                window.location.href = "/index.html";
            }
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
    const password = loginForm.password.value;
    if (emailRegEx.test(email)) {
        main.signInWithEmailAndPassword(main.auth, email, password)
            .then((cred) => {
                alert("Sign in successful");
                window.location.href = "/index.html";
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        alert("Please enter valid UTM student email");
    }
});
