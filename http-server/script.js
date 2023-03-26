let form = document.getElementById("registration-form");

const form_Data = () => {
  let entries = localStorage.getItem("registration-entries");
  if (entries) {
    entries = JSON.parse(entries);
  } else {
    entries = [];
  }
  return entries;
};

let registrationentries = form_Data();

const display_Entries = () => {
  const entries = form_Data();
  const tableEntries = entries
    .map((entry) => {
      const nameInput = `<td class='border px-4 py-2'>${entry.name}</td>`;
      const emailInput = `<td class='border px-4 py-2'>${entry.email}</td>`;
      const passwordInput = `<td class='border px-4 py-2'>${entry.password}</td>`;
      const dobInput = `<td class='border px-4 py-2'>${entry.dob}</td>`;
      const acceptTermsInput = `<td class='border px-4 py-2'>${entry.acceptedTC}</td>`;
      const row = `<tr>${nameInput} ${emailInput} ${passwordInput} ${dobInput} ${acceptTermsInput}</tr>`;
      return row;
    })
    .join("\n");

  const table = `<table class="table-auto w-full"><tr>
     <th class="px-4 py-2">Name</th>
     <th class="px-4 py-2">Email</th>
     <th class="px-4 py-2">Password</th>
     <th class="px-4 py-2">Dob</th>
     <th class="px-4 py-2">Accepted terms?</th>
     </tr>${tableEntries} </table>`;
  let details = document.getElementById("registration-entries");
  details.innerHTML = table;
};
const data = (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const dob = document.getElementById("dob").value;
  const acceptedTC = document.getElementById("acceptTC").checked;

  const entry = {
    name,
    email,
    password,
    dob,
    acceptedTC,
  };
  registrationentries.push(entry);

  localStorage.setItem(
    "registration-entries",
    JSON.stringify(registrationentries)
  );
  display_Entries();
};

function getAge() {
  const dobEle = document.getElementById("dob");
  const dobV = dobEle.value;
  const dobD = new Date(dobV);
  const curr = new Date();
  const month = dobD.getMonth();
  const day = dobD.getDate();
  let age = curr.getFullYear() - dobD.getFullYear();
  let checkmonth = curr.getMonth() < month;
  let checkday = curr.getMonth() === month && curr.getDate() < day;
  if (checkmonth || checkday) {
    age--;
  }
  const validAge = age > 18 && age < 55;
  if (!validAge) {
    dobEle.setCustomValidity("Age must be between 18 and 55 years to register");
    dobEle.reportValidity();
  } else {
    dobEle.setCustomValidity("");
  }
}

form.addEventListener("submit", data);
display_Entries();
