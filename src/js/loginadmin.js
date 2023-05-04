////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "admins", user.uid)).then((doc) => {
            userData = doc.data();
            window.location.href = "/adminmain.html";
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;
    main.getDoc(main.doc(main.db, "admins", username))
        .then((doc) => {
            let loginData = doc.data();

            main.signInWithEmailAndPassword(main.auth, loginData.email, password)
                .then((cred) => {
                    alert("Sign in successful");
                    window.location.href = "/adminmain.html";
                })
                .catch((error) => {
                    alert(error.message);
                });
        })
        .catch((error) => {
            alert(error);
        });
});
