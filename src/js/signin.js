const main = require("./main.js"); //MUST HAVE

const loginbtn = document.querySelector("#loginbtn");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

loginbtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(email.value + " " + password.value);
    main.signInWithEmailAndPassword(main.auth, email.value, password.value)
        .then((cred) => {
            alert(cred.user.email);
        })
        .catch((error) => {
            alert(error.message);
        });
});
