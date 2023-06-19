////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
        });
    } else {
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////

const signoutbtn = document.querySelector("#signoutbtn");

signoutbtn.addEventListener("click", (e) => {
    main.signOut(main.auth)
        .then(() => {
            alert("Signing out...");
            window.location.href = "/signin.html";
        })
        .catch((error) => {
            console.log(error.message);
        });
});

$(function () {
    let bookingList = [];
    let index = 0;
    const bookingListForm = document.querySelector("#bookingListForm");

    const q = main.query(main.bookingDB, main.where("status", "==", "waiting"));
    main.onSnapshot(q, (snapshot) => {
        bookingList = [];
        if (!snapshot.empty) {
            snapshot.docs.forEach((doc) => {
                bookingList.push({ ...doc.data(), bookingId: doc.id });
            });
        }
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
    });
});

function updateCurrentList(currentView) {
    bookingListForm.origin.value = currentView.from;
    bookingListForm.destination.value = currentView.destination;
    bookingListForm.person.value = currentView.person;
    bookingListForm.datetime.value = currentView.datetime;
    bookingListForm.notes.value = currentView.notes;
}
