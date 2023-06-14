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
      userTable.innerHTML = `
      <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matric Number</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>User Type</th>
              <th>Vehicle Color</th>
              <th>Vehicle Type</th>
              <th>Plate Number</th>
            </tr>
          </thead>
          <tbody>
            ${userT.map((users) => `
              <tr class="${users.personalDetails.userId}">
                <td>${users.personalDetails.fullname}</td>
                <td>${users.personalDetails.matric}</td>
                <td>${users.personalDetails.email}</td>
                <td>${users.personalDetails.phoneNumber}</td>
                <td>${users.type.toUpperCase()}</td>
                ${
                  users.driverDetails && users.driverDetails.vehicle ? `
                    <td>${users.driverDetails.vehicle.colour}</td>
                    <td>${users.driverDetails.vehicle.type}</td>
                    <td>${users.driverDetails.vehicle.plateNumber}</td>
                  ` : `
                    <td colspan="3">NO INFORMATION</td>
                  `
                }
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  });

  