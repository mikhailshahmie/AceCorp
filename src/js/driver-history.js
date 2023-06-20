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
            const redirectBtn = document.querySelector("#redirect");
            const driverBookhistory = document.querySelector("#driverBookhistory");

            if (userData.type == "passenger") {
                redirectBtn.href = "driver-application.html";
                redirectBtn.text = "Be a Driver";
                driverBookhistory.style.display = "none";
            } else if (userData.type == "driver") {
                //NEED CHANGING
                driverBookhistory.style.display = "block";
                redirectBtn.href = "driver-home.html";
                redirectBtn.text = "Driver dashboard";
            }
        });

        //CHECK IF THE CURRENT USER HAVE AN ACTIVE BOOKING
        const q = main.query(main.bookingDB, main.where("driverId", "==", main.auth.currentUser.uid));
        main.onSnapshot(q, (snapshot) => {
            let history = [];
            const historyList = document.querySelector("#historyList");
            if (!snapshot.empty) {
                snapshot.docs.forEach((doc) => {
                    history.push({ ...doc.data(), bookingId: doc.id });
                });
                historyList.innerHTML = "";
                history.forEach((booking) => {
                    historyList.innerHTML +=
                        '<div class="' +
                        booking.bookingId +
                        ' border p-3"><div class="row"><div class="col text-center"><span class="d-inline-block">' +
                        booking.datetime +
                        ' </span></div><div class="col text-"><span class="d-inline-block"> ' +
                        booking.status.toUpperCase() +
                        ' </span></div></div><div class="row"><div class="col text-center"><span class="d-inline-block text-truncate" id="origin" style="max-width: 300px">' +
                        booking.from +
                        '</span><br /><i class="bi bi-arrow-down-circle"></i><br /><span class="d-inline-block text-truncate" id="destination" style="max-width: 300px">' +
                        booking.destination +
                        "</span></div></div></div>";

                    //REFERENCE FOR ABOVE CODE
                    // <div class="border p-3">
                    //     <div class="row">
                    //         <div class="col text-center">
                    //             <span class="d-inline-block"> Datetime </span>
                    //         </div>
                    //         <div class="col text-center">
                    //             <span class="d-inline-block"> Status </span>
                    //         </div>
                    //     </div>
                    //     <div class="row">
                    //         <div class="col text-center">
                    //             <span class="d-inline-block text-truncate" id="origin" style="max-width: 300px">
                    //                 Origin
                    //             </span>
                    //             <br />
                    //             <i class="bi bi-arrow-down-circle"></i>
                    //             <br />
                    //             <span class="d-inline-block text-truncate" id="destination" style="max-width: 300px">
                    //                 Destination
                    //             </span>
                    //         </div>
                    //     </div>
                    // </div>;
                });
            }
        });
    } else {
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////

//LOGOUT
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
