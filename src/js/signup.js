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

const signupForm = document.querySelector("#signupForm");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const terms = signupForm.terms.checked;
  const fullname = signupForm.fullname.value;
  const email = signupForm.email.value.toLowerCase();
  const matric = signupForm.matric.value.toUpperCase();
  const password = signupForm.password.value;
  const passwordConfirm = signupForm.password2.value;
  let emailRegEx = /[A-Za-z]+@graduate.utm.my\i*$/;
  let matricRegEx = /[A-Za-z]\d\d[A-Za-z][A-Za-z]\d\d\d\d\i*$/;

  if (!fullname) {
    alert("Name is missing");
  } else if (!emailRegEx.test(email)) {
    alert("Invalid email, please use UTM official student email");
  } else if (!matricRegEx.test(matric)) {
    alert("Invalid matric number format");
  } else if (password != passwordConfirm) {
    alert("Passwords are not the same");
  } else if (!terms) {
    alert("Please agree to these terms");
  } else {
    main
      .createUserWithEmailAndPassword(main.auth, email, password)
      .then((cred) => {
        if (cred.user != null) {
          main
            .setDoc(main.doc(main.db, "users", cred.user.uid), {
              fullname: fullname,
              email: email,
              matric: matric,
              type: "passenger",
            })
            .then(() => {
              signupForm.reset;
            });

          main
            .sendEmailVerification(cred.user)
            .then(() => {
              alert(
                "Account created successfully, please check your email for verification"
              );
              window.location.href = "/signin.html";
            })
            .catch((err) => {
              alert(err.message);
            });
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }
});
