////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");

main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
        if (emailRegEx.test(user.email)) {
            main.signOut(main.auth)
                .then(() => {
                    alert("Logging out...");
                    window.location.href = "/loginadmin.html";
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
        const q = main.query(main.bookingDB);
        main.getDocs(q).then((snapshot) => {
            let Trecord = [];
            const TRecordTable = document.querySelector("#TRecordTable");

            if (!snapshot.empty) {
                snapshot.docs.forEach((doc) => {
                    Trecord.push({ ...doc.data(), bookingId: doc.id });
                });

                Trecord.sort((a, b) => {
                    const dateA = new Date(a.datetime);
                    const dateB = new Date(b.datetime);
                    return dateB - dateA;
                });

                const renderTable = (data) => {
                    TRecordTable.innerHTML = `
                                <tr>
                                    <th>Date and Time</th>
                                    <th>Passenger ID</th>
                                    <th>Driver ID</th>
                                    <th>Status</th>
                                    <th>Origin</th>
                                    <th>Destination</th>
                                </tr>`;
                    if (data.length <= 0) {
                        TRecordTable.innerHTML += `
                                <tr">
                                    <td colspan="6" style="text-align: center">NO TRANSACTION FOUND</td>
                                </tr>
                            `;
                    }
                    data.forEach((booking) => {
                        main.getDoc(main.doc(main.db, "users", booking.passengerId)).then((passengerDoc) => {
                            let passengerEmail = passengerDoc.data().personalDetails.email;
                            main.getDoc(main.doc(main.db, "users", booking.driverId)).then((driverDoc) => {
                                let driverEmail = driverDoc.data().personalDetails.email;
                                TRecordTable.innerHTML += `
                                <tr class="${booking.bookingId}">
                                    <td>${booking.datetime}</td>
                                    <td>${passengerEmail}</td>
                                    <td>${driverEmail}</td>
                                    <td>${booking.status.toUpperCase()}</td>
                                    <td>${booking.from}</td>
                                    <td>${booking.destination}</td>
                                </tr>
                            `;
                            });
                        });
                    });
                };

                const filterData = (status) => {
                    let filteredData = Trecord;
                    if (status !== "all") {
                        filteredData = Trecord.filter((booking) => booking.status === status);
                    }
                    renderTable(filteredData);
                };

                const Filter = document.querySelector("#Filter");
                Filter.addEventListener("change", () => {
                    const selectedStatus = Filter.value;
                    filterData(selectedStatus);
                });

                renderTable(Trecord);
            }
        });
    } else {
        window.location.href = "/loginadmin.html";
    }
});
