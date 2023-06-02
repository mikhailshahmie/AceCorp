////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
        if (!emailRegEx.test(user.email)) {
            window.location.href = "/adminmain.html";
        }
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
            //CHANGE DRIVER OR PASSENGER BUTTON
            const redirectBtn = document.querySelector("#redirect");
            if (userData.type == "passenger") {
                redirectBtn.href = "driver-application.html";
                redirectBtn.text = "Be a Driver";
                //display profile
                document.getElementById("profileForm").style.display = "block";
                document.querySelector("#displayName").value = userData.fullname;
                document.querySelector("#displayEmail").value = userData.email;
                document.querySelector("#displayMatric").value = userData.matric;
                document.querySelector("#displayPhone").value = userData.phone;
            } else if (userData.type == "driver") {
                //NEED CHANGING
                redirectBtn.href = "driver-home.html";
                redirectBtn.text = "Driver dashboard";
                document.getElementById("profileForm").style.display = "block";
                document.getElementById("vehicleForm").style.display = "block";
                document.getElementById("documentForm").style.display = "block";
                document.querySelector("#displayName").value = userData.fullname;
                document.querySelector("#displayEmail").value = userData.email;
                document.querySelector("#displayMatric").value = userData.matric;
                document.querySelector("#displayPhone").value = userData.phone;
            }
            const updateBtn = document.querySelector("updatebtn");
            updateBtn.addEventListener("submit", () => {
              const updateName = displayName.value.trim();
              const updatePhone = displayPhone.value.trim();
              main.updateDoc(main.doc(main.db, "users", user.uid), {
                fullname: updateName
                //phone: updatePhone
              })
                .then(() => {
                  console.log("Update Successful");
                })
                .catch((error) => {
                  console.log("Error", error);
                });
            });
            
            
        });
    } else {
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////
//Display User Data
/*
main.onAuthStateChanged(main.auth, async (user) => {
    if (user) {
      const dbRef = main.ref(main.db, `users/${user.uid}`);
      main.get(dbRef).then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          // Display user data
          document.querySelector("#displayName").value = userData.fullname;
          document.querySelector("#displayEmail").value = userData.email;
          document.querySelector("#displayMatric").value = userData.matric;
          document.querySelector("#displayPassword").value = userData.password;
        }
      });
    } else {
      window.location.href = "/signin.html";
    }
  });*/

  
//Display User Data Experimenting
/*const user = firebase.auth().currentUser;
if ( user !== null){
    const name = document.getElementById("displayName");
    const email = document.getElementById("displayEmail");
    const matric = document.getElementById("displayEmail");
}*/


//Sign Out Functionality
const signoutbtn = document.querySelector("#signoutbtn");

signoutbtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to sign out?")) {
        main.signOut(main.auth)
            .then(() => {
                alert("Signing out...");
                window.location.href = "/signin.html";
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
});