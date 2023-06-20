////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
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
        const q = main.query(main.bookingDB, main.where("passengerId", "==", user.uid), main.where("status", "in", ["waiting", "ongoing"]));
        main.onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setTimeout(function () {
                    //go to current booking passenger page
                    window.location.href = "/book-current.html";
                }, 500);
            }
        });

        //CHECK IF THE CURRENT DRIVER HAVE AN ACTIVE BOOKING
        const q2 = main.query(main.bookingDB, main.where("driverId", "==", user.uid), main.where("status", "==", "ongoing"));
        main.onSnapshot(q2, (snapshot) => {
            if (!snapshot.empty) {
                setTimeout(function () {
                    //go to current booking driver page
                    window.location.href = "/driver-book.html";
                }, 500);
            }
        });
    } else {
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////

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

$(function () {
    let bookingList = [];
    let index = 0;
    const bookingListForm = document.querySelector("#bookingListForm");

    const q = main.query(main.bookingDB, main.where("status", "==", "waiting"));
    main.onSnapshot(q, (snapshot) => {
        bookingList = [];
        if (!snapshot.empty) {
            document.querySelector("#noBookingView").style.display = "none";
            document.querySelector("#bookingView").style.display = "block";
            snapshot.docs.forEach((doc) => {
                bookingList.push({ ...doc.data(), bookingId: doc.id });
            });
            updateCurrentList(bookingList[0]);

            $("#nextBtn").click((e) => {
                e.preventDefault();
                if (index < bookingList.length - 1) {
                    index++;
                } else {
                    index = 0;
                }
                updateCurrentList(bookingList[index]);
            });

            $("#previousBtn").click((e) => {
                e.preventDefault();
                if (index > 0) {
                    index--;
                } else {
                    index = bookingList.length - 1;
                }
                updateCurrentList(bookingList[index]);
            });

            //ACCEPT RIDE
            $("#requestBtn").click((e) => {
                let bookingId = bookingList[index].bookingId;
                let driverId = main.auth.currentUser.uid;
                main.updateDoc(main.doc(main.db, "bookings", bookingId), {
                    driverId: driverId,
                    status: "ongoing",
                })
                    .then(() => {
                        //NEED CHANGING
                        alert("Ride accepted");
                    })
                    .catch((err) => {
                        alert("Something went wrong:" + err.message);
                    });
            });
        } else {
            document.querySelector("#noBookingView").style.display = "block";
            document.querySelector("#bookingView").style.display = "none";
        }
    });
});

function updateCurrentList(currentView) {
    bookingListForm.origin.value = currentView.from;
    bookingListForm.destination.value = currentView.destination;
    bookingListForm.person.value = currentView.person;
    bookingListForm.datetime.value = currentView.datetime;
    bookingListForm.notes.value = currentView.notes;
    bookingListForm.price.value = currentView.price;
}
