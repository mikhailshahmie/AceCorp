////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");

const q = main.query(main.usersDB);
main.getDocs(q).then((snapshot) => {
  let userT = [];
  const userTable = document.querySelector("#userTable");
  if (!snapshot.empty) {
    snapshot.docs.forEach((doc) => {
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
            </tr>
          </thead>
          <tbody>
            ${filteredUsers
              .map((user) => `
                <tr class="${user.personalDetails.userId}">
                  <td>${user.personalDetails.fullname}</td>
                  <td>${user.personalDetails.matric}</td>
                  <td>${user.personalDetails.email}</td>
                  <td>${user.personalDetails.phoneNumber}</td>
                  ${selectedValue === "driver" && user.driverDetails && user.driverDetails.vehicle ? `
                    <td>${user.driverDetails.vehicle.colour}</td>
                    <td>${user.driverDetails.vehicle.type}</td>
                    <td>${user.driverDetails.vehicle.plateNumber}</td>
                  ` : ""}
                </tr>
              `)
              .join("")}
          </tbody>
        </table>
      `;
    }

    // Initial rendering
    handleFilterChange();
  }
});


  