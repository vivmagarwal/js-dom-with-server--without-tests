// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:${
  import.meta.env.REACT_APP_JSON_SERVER_PORT
}`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ***** Constants / Variables ***** //
const employeeURL = `${baseServerURL}/employees`;
const userRegisterURL = `${baseServerURL}/register`;
let mainSection = document.getElementById("data-list-wrapper");

// employees
let empNameInput = document.getElementById("employee-name");
let empImgInput = document.getElementById("employee-image");
let empDeptInput = document.getElementById("employee-dept");
let empSalaryInput = document.getElementById("employee-salary");
let empCreateBtn = document.getElementById("add-employee");
let sortAtoZBtn = document.getElementById("sort-low-to-high");
let sortZtoABtn = document.getElementById("sort-high-to-low");
let filterLessThan1LBtn = document.getElementById("filter-less-than-1L");
let filterMoreThanEqualLBtn = document.getElementById(
  "filter-more-than-equal-1L"
);

// Update employees
let updateEmpIdInput = document.getElementById("update-employee-id");
let updateEmpNameInput = document.getElementById("update-employee-name");
let updateEmpImageInput = document.getElementById("update-employee-image");
let updateEmpDeptInput = document.getElementById("update-employee-dept");
let updateEmpSalaryInput = document.getElementById("update-employee-salary");
let updateEmpUpdateBtn = document.getElementById("update-employee");


//Update Salary
let updateScoreEmpId = document.getElementById("update-score-employee-id");
let updateScoreEmpSalary = document.getElementById(
  "update-score-employee-salary"
);
let updateScoreEmpSalaryButton = document.getElementById(
  "update-score-employee"
);

//Employee Data
let employeesData = [];

// ***** Event listeners ***** //
window.addEventListener("load", () => {
  fetchAndRenderEmployees();
});

empCreateBtn.addEventListener("click", () => {
  let empName = empNameInput.value;
  let empImg = empImgInput.value;
  let empDept = empDeptInput.value;
  let empSal = empSalaryInput.value;

  // do some validation

  let userObj = {
    name: empName,
    image: empImg,
    department: empDept,
    salary: +empSal,
  };

  createEmployee(userObj);
  fetchAndRenderEmployees();
});

function createEmployee(userObj) {
  //console.log(userObj, typeof userObj.salary);
  fetch(`${baseServerURL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
    });
}

updateEmpUpdateBtn.addEventListener("click", function () {
  let empId = updateEmpIdInput.value;
  let empName = updateEmpNameInput.value;
  let empImage = updateEmpImageInput.value;
  let empDept = updateEmpDeptInput.value;
  let empSalary = updateEmpSalaryInput.value;

  let empObj = {};
  if (empId) empObj["id"] = empId;
  if (empName) empObj["name"] = empName;
  if (empImage) empObj["image"] = empImage;
  if (empDept) empObj["salary"] = empDept;
  if (empSalary) empObj["salary"] = empSalary;

  fetch(`${baseServerURL}/employees/${empId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empObj),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(`Data of ${empId} updated.`);
      fetchAndRenderEmployees();
    })
    .catch((err) => alert(JSON.stringify(err)));
});

updateScoreEmpSalaryButton.addEventListener("click", function () {
  let empId = updateScoreEmpId.value;
  let empSalary = updateScoreEmpSalary.value;

  fetch(`${baseServerURL}/employees/${empId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      salary: empSalary,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(`Salary of emp with id ${empId} updated to Rs. ${empSalary}.`);
      fetchAndRenderEmployees();
    })
    .catch((err) => alert(JSON.stringify(err)));
});

sortAtoZBtn.addEventListener("click", () => {
   //fetchAndRenderEmployees("?_sort=salary&_order=asc");
   if (employeesData && employeesData.length) {
    employeesData.sort((a,b) => {
      return +a.salary - +b.salary;
    })
    renderCardList(employeesData)
  } else {
    console.log('nothing to sort')
  }
});

sortZtoABtn.addEventListener("click", () => {
  //fetchAndRenderEmployees("?_sort=salary&_order=desc");

  if (employeesData && employeesData.length) {
    employeesData.sort((a,b) => {
      return +b.salary - +a.salary;
    })
    renderCardList(employeesData)
  } else {
    console.log('nothing to sort')
  }
});

filterLessThan1LBtn.addEventListener("click", () => {
  //  fetchAndRenderEmployees("?salary_gte=0 &salary_lte=99999");

  if (employeesData && employeesData.length) {
    let filteredEmployees = employeesData.filter(e => +e.salary < 100000)
    renderCardList(filteredEmployees)
  } else {
    console.log('nothing to filter')
  }
});
filterMoreThanEqualLBtn.addEventListener("click", () => {
  // fetchAndRenderEmployees(`?salary_gte=99999 &salary_lte=50000000`);

  if (employeesData && employeesData.length) {
    let filteredEmployees = employeesData.filter(e => +e.salary >= 100000)
    renderCardList(filteredEmployees)
  } else {
    console.log('nothing to filter')
  }
});

// Employees
function fetchAndRenderEmployees(queryParamString = null) {
  fetch(`${baseServerURL}/employees${queryParamString ? queryParamString : ""}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      let empObj = data.map((item) => ({
        id: item.id,
        title: item.name,
        salary: +item.salary,
        linkText: "Edit",
        linkUrl: "#",
        imageUrl: `${baseServerURL}${item.image}`,
      }));

      employeesData = empObj;
      renderCardList(empObj);
    });
}

// ***** Utilities ***** //
// array of objects
function renderCardList(cardData) {
  let cardList = `
    <div class="card-list">
      ${cardData
        .map((item) =>
          getCard(
            item.id,
            item.title,
            item.salary,
            item.linkText,
            item.linkUrl,
            item.imageUrl
          )
        )
        .join("")}
    </div>
  `;
  mainSection.innerHTML = cardList;
  let editLinks = document.querySelectorAll(".card-link");
  for (let editLink of editLinks) {
    editLink.addEventListener("click", (e) => {
      e.preventDefault();
      let currentId = e.target.dataset.id;
      populateEditForms(currentId);
    });
  }
}

function getCard(id, title, salary, linkText, linkUrl, imageUrl) {
 // console.log(typeof(salary));
  let card = `
      <div class="card" data-id=${id} >
        <div class="card-img">
        <img src=${imageUrl} alt="employee" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <div class="card-salary">
            ${salary}
          </div>
          <a href="#" data-id=${id} class="card-link">${linkText}</a>
        </div>
      </div>
  `;
  return card;
}

function populateEditForms(currentId) {
  let table = "employees";
  fetch(`${baseServerURL}/${table}/${currentId}`)
    .then((res) => res.json())
    .then((data) => {
      updateEmpIdInput.value = data.id;
      updateEmpNameInput.value = data.name;
      updateEmpImageInput.value = data.image;
      updateEmpDeptInput.value = data.department;
      updateEmpSalaryInput.value = data.salary;
      updateScoreEmpId.value = data.id;
      updateScoreEmpSalary.value = data.salary;
    });
}
