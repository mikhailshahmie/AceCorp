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

        const q = main.query(main.usersDB);
        main.onSnapshot(q, (snapshot) => {
            let userT = [];
            const userTable = document.querySelector("#userTable");
            if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                    userT.push({ ...doc.data(), userId: doc.id });
                });

                const filterDropdown = document.querySelector("#Filter");
                filterDropdown.addEventListener("change", handleFilterChange);

                function handleFilterChange() {
                    const selectedValue = filterDropdown.value;
                    const filteredUsers = userT.filter((user) => user.type === selectedValue || selectedValue === "all");

                    userTable.innerHTML = `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matric Number</th>
              <th>Email</th>
              <th>Phone Number</th>
              ${selectedValue === "driver" ? `<th>Vehicle Color</th><th>Vehicle Type</th><th>Plate Number</th>` : ""}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers
                .map(
                    (user) => `
                <tr id="${user.userId}">
                  <td>${user.personalDetails.fullname}</td>
                  <td><span class="editable matric" data-field="matric">${user.personalDetails.matric}</span></td>
                  <td>${user.personalDetails.email}</td>
                  <td>${user.personalDetails.phoneNumber}</td>
                  ${
                      selectedValue === "driver" && user.driverDetails && user.driverDetails.vehicle
                          ? `
                    <td>${user.driverDetails.vehicle.colour}</td>
                    <td>${user.driverDetails.vehicle.type}</td>
                    <td>${user.driverDetails.vehicle.plateNumber}</td>
                  `
                          : ""
                  }
                  <td><button class="updateBtn">Update</button></td>
                </tr>
              `
                )
                .join("")}
          </tbody>
        </table>
      `;

                    // Add event listeners to editable fields
                    const editableFields = document.querySelectorAll(".editable");
                    editableFields.forEach((field) => {
                        field.addEventListener("click", handleFieldClick);
                    });
                }

                function handleFieldClick(event) {
                    event.target.contentEditable = true;
                    event.target.focus();
                }

                // Initial rendering
                handleFilterChange();
            }
        });
    } else {
        window.location.href = "/loginadmin.html";
    }
});

$(document).on("click", ".updateBtn", function (e) {
    let userDetails = null;
    let userId = $(this).closest("tr")[0].id;
    let rowId = $(this).closest("tr");
    let matric = rowId.find(".matric").text();
    let matricRegEx = /[A-Za-z]\d\d[A-Za-z][A-Za-z]\d\d\d\d\i*$/;
    if (!matricRegEx.test(matric)) {
        alert("Please make sure metric number is in UTM format");
        location.reload();
        return;
    }
    console.log(getUserDetails(userId));
    main.getDoc(main.doc(main.db, "users", userId)).then((userDoc) => {
        let personalDetails = userDoc.data().personalDetails;

        userDetails = {
            email: personalDetails.email,
            fullname: personalDetails.fullname,
            matric: matric,
            phoneNumber: personalDetails.phoneNumber,
        };

        updateMatric(userId, userDetails);
    });
});

function updateMatric(userId, userDetails) {
    main.updateDoc(main.doc(main.db, "users", userId), {
        personalDetails: userDetails,
    }).then(() => {
        alert("Update successful");
    });
}

function getUserDetails(id) {
    let personalDetails = null;
    main.getDoc(main.doc(main.db, "users", id)).then((userDoc) => {
        personalDetails = userDoc.data().personalDetails;
    });
    return personalDetails;
}
