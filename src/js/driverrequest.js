////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
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
        //GET PENDING REQUEST FROM DATABASE
        const q = main.query(main.driverReqDB, main.where("status", "==", "pending"));
        main.onSnapshot(q, (snapshot) => {
            let driverReq = [];
            const requestTable = document.querySelector("#requestTable");
            if (!snapshot.empty) {
                snapshot.docs.forEach((doc) => {
                    driverReq.push({ ...doc.data(), userId: doc.id });
                });
                $("#requestTable tr").remove();
                requestTable.innerHTML = "<tr>" + "<th>Name</th>" + "<th>Matric Number</th>" + "<th>Matric Picture</th>" + "<th>License Picture</th>" + "<th>Status</th>" + "<th>Action</th>" + "</tr>";
                driverReq.forEach((request) => {
                    main.getDoc(main.doc(main.db, "users", request.userId)).then((userDoc) => {
                        let userData = userDoc.data();
                        requestTable.innerHTML +=
                            '<tr id="' +
                            request.userId +
                            '"><td>' +
                            userData.personalDetails.fullname +
                            "</td><td>" +
                            userData.personalDetails.matric +
                            '<td style="text-align: center"><a target="_blank" href="' +
                            request.matric +
                            '"><img class="rounded" src="' +
                            request.matric +
                            '" alt="Matric proof" /></a></td><td style="text-align: center"><a target="_blank" href="' +
                            request.license +
                            '"><img class="rounded" src="' +
                            request.license +
                            '" alt="License proof" /></a></td><td style="text-align: center">' +
                            request.status.toUpperCase() +
                            '</td><td style="text-align: center"><button class="btn btn-success btnReq" data-button-type="approve">Approve</button><button class="btn btn-danger btnReq" data-button-type="reject">Reject</button></td></tr>';
                    });
                    //REFERENCE FOR ABOVE CODE
                    // <tr>
                    //     <td>John Doe</td>
                    //     <td>B22EC0001</td>
                    //     <td style="text-align: center">
                    //         <a target="_blank" href="">
                    //             <img class="rounded" src="" alt="Matric proof" />
                    //         </a>
                    //     </td>
                    //     <td style="text-align: center">
                    //         <a target="_blank" href="">
                    //             <img class="rounded" src="" alt="License proof" />
                    //         </a>
                    //     </td>
                    //     <td>Pending</td>
                    //     <td>
                    //         <button>Approve</button>
                    //         <button>Reject</button>
                    //     </td>
                    // </tr>;
                });
            } else {
                $("#requestTable tr").remove();
                requestTable.innerHTML = '<tr><th>Name</th><th>Matric Number</th><th>Matric Picture</th><th>License Picture</th><th>Status</th><th>Action</th></tr><tr><td colspan="6" style="text-align: center">NO PENDING REQUEST</td></tr>';
            }
        });
    } else {
        window.location.href = "/loginadmin.html";
    }
});
/////////////////////////////////////////////////////////////////

$(document).on("click", ".btnReq", function (e) {
    let btnType = $(this)[0].getAttribute("data-button-type");
    let userId = $(this).closest("tr")[0].id;
    const approved = "approved";
    const rejected = "rejected";

    if (confirm("Are you sure you want to " + btnType.toUpperCase() + " request?")) {
        if (btnType == "approve") {
            updateRequest(userId, approved);
        } else if (btnType == "reject") {
            updateRequest(userId, rejected);
        }
    }
});

function updateRequest(userId, status) {
    try {
        main.updateDoc(main.doc(main.db, "driverRequest", userId), {
            status: status,
        });

        if (status == "approved") {
            main.getDoc(main.doc(main.db, "driverRequest", userId)).then((doc) => {
                let matricURL = doc.data().matric;
                let licenseURL = doc.data().license;

                let driverDetails = {
                    vehicle: {
                        colour: "",
                        plateNumber: "",
                        type: "",
                    },
                    documents: {
                        license: licenseURL,
                        matric: matricURL,
                        paymentQR: "https://firebasestorage.googleapis.com/v0/b/utm-transporter.appspot.com/o/qr%2B.png?alt=media&token=e537fa69-a401-4210-b283-3f03ba6e8cf1",
                    },
                };

                main.updateDoc(main.doc(main.db, "users", userId), {
                    driverDetails: driverDetails,
                    type: "driver",
                });
            });
        }
    } catch (e) {
        console.log(e.message);
    }
}
