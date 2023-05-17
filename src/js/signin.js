////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
            if (user.emailVerified) {
                window.location.href = "/passenger-home.html";
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
                main.onAuthStateChanged(main.auth, (user) => {
                    if (user) {
                        if (!user.emailVerified) {
                            alert("Please check your email for verification (Please check in spam too if you don't see it)");
                        } else {
                            alert("Sign in successful");
                            window.location.href = "/passenger-home.html";
                        }
                    } else {
                    }
                });
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        alert("Please enter valid UTM student email");
    }
});
