"use strict";

window.addEventListener("DOMContentLoaded", init);
let HTML = {};
let allStudents = [];
let houses = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];
let expelled = [];
let systemHacked = false;

const Student = {
  firstname: " ",
  middlename: null,
  lastname: "",
  nickname: null,
  gender: "",
  house: "",
  imageSrc: null,
  prefect: false,
  squad: false,
  expel: false
};

function init() {
  console.log("ready");

  HTML.sortname = document.querySelectorAll("[data-action=sort]");
  HTML.filter = document.querySelectorAll("[data-action='filter']");
  HTML.expel = document.querySelector(".expel");
  HTML.filter.forEach(btn => {
    btn.addEventListener("click", filterButton);
  });
  HTML.sortname.forEach(button => {
    button.addEventListener("click", sortingName);
  });

  loadJSON();
}
//filter button
function filterHouses(house) {
  const result = allStudents.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === house) return true;
    else return false;
  }
  return result;
}

function filterButton(e) {
  let selected_filter = "*";

  selected_filter = e.target.dataset.filter;
  console.log("filter type : " + selected_filter);
  if (selected_filter === "*") displayList(allStudents);
  else displayList(filterHouses(selected_filter));
}
//sorting function
function sortingName(event) {
  console.log("sorting name");
  const sortDirect = event.target.dataset.sortDirection;
  const sortInfo = event.target.dataset.sort;

  if (sortDirect == "asc") {
    event.target.dataset.sortDirection = "dsc";
  } else if (sortDirect == "dsc") {
    event.target.dataset.sortDirection = "asc";
  }
  displayList(sortByName(sortInfo, sortDirect));
}
function sortByName(sortInfo, sortDirect) {
  console.log("sortByName");
  let sortedList;

  if (sortDirect == "asc") {
    sortedList = allStudents.sort(comparAsc);
    console.log("sortedAsc");
  } else if (sortDirect == "dsc") {
    sortedList = allStudents.sort(compareDsc);
    console.log("sortDsc");
  }

  function comparAsc(a, b) {
    console.log("compareAsc");
    if (a[sortInfo] < b[sortInfo]) {
      return -1;
    } else {
      return 1;
    }
  }
  function compareDsc(a, b) {
    console.log("compareDsc");
    if (a[sortInfo] > b[sortInfo]) {
      return -1;
    } else {
      return 1;
    }
  }
  return sortedList;
}

async function loadJSON() {
  const response = await fetch(
    "https://petlatkea.dk/2020/hogwarts/students.json"
    //"https://petlatkea.dk/2020/hogwarts/families.json"
  );
  const jsonData = await response.json();

  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);
  displayList(allStudents);
}

function preapareObject(jsonObject) {
  const student = Object.create(Student);
  const studentName = jsonObject.fullname.trim();
  const texts = jsonObject.fullname.split(" ");

  student.middlename = texts[1];
  student.lastname = texts[2];
  student.house = jsonObject.house;
  student.gender = jsonObject.gender;

  if (studentName.indexOf(" ") === -1) {
    student.firstname = studentName.substring(0, studentName.length);
  } else {
    student.firstname = studentName.substring(0, studentName.indexOf(" "));
    //capitalise last name
    student.lastname = studentName.substring(
      studentName.lastIndexOf(" ") + 1,
      studentName.length
    );
    student.lastname =
      student.lastname[0].toUpperCase() +
      student.lastname.substring(1, student.lastname.length).toLowerCase();

    if (student.lastname.indexOf("-") !== -1) {
      student.lastname =
        student.lastname.substring(0, student.lastname.indexOf("-") + 1) +
        student.lastname[student.lastname.indexOf("-") + 1].toUpperCase() +
        student.lastname.substring(
          student.lastname.indexOf("-") + 2,
          student.lastname.length
        );
    }
  }

  //capitalie first name
  student.firstname =
    student.firstname[0].toUpperCase() +
    student.firstname.substring(1, student.firstname.length).toLowerCase();

  if (studentName.indexOf(" ") !== studentName.lastIndexOf(" ")) {
    // Find only nicknames and capitalize
    if (studentName.indexOf(" ") + 1 == studentName.indexOf('"')) {
      student.nickname = studentName.substring(
        studentName.indexOf('"') + 1,
        studentName.lastIndexOf('"')
      );
      student.nickname =
        student.nickname[0].toUpperCase() +
        student.nickname.substring(1, student.nickname.length).toLowerCase();
    }
    // Find only middlename and capitalize
    else {
      student.middlename = studentName.substring(
        studentName.indexOf(" ") + 1,
        studentName.lastIndexOf(" ")
      );
      student.middlename =
        student.middlename[0].toUpperCase() +
        student.middlename
          .substring(1, student.middlename.length)
          .toLowerCase();
      student.nickname = null;
    }
  }
  // Set all others to null
  else {
    student.middlename = null;
    student.nickname = null;
  }

  //capitalise first letter in gender
  if (student.gender === "boy") {
    student.gender = "Boy";
  } else {
    student.gender = "Girl";
  }

  //capitalise first letter in house
  if (student.house.trim()[0].toLowerCase() === "g") {
    student.house = houses[0];
  } else if (student.house.trim()[0].toLowerCase() === "h") {
    student.house = houses[1];
  } else if (student.house.trim()[0].toLowerCase() === "r") {
    student.house = houses[2];
  } else {
    student.house = houses[3];
  }
  return student;
}
//expel function
function expelStudent(student) {
  console.log("expel student");
  const expel = allStudents.indexOf(student);
  allStudents.splice(expel, 1);
  displayList(allStudents);
}
//display list
function displayList(students) {
  document.querySelector("#studentlist").innerHTML = "";

  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#studentTemplate")
    .content.cloneNode(true);
  if (systemHacked) {
    student.house = Math.floor(Math.random() * 4);
  }
  // set clone data
  //console.log(`images/${student.lastname.toLowerCase()}_${student.firstname[0].toLowerCase()}.png`);
  clone.querySelector(".firstname").textContent = student.firstname;
  clone.querySelector(".middlename").textContent = student.middlename;
  clone.querySelector(".lastname").textContent = student.lastname;
  clone.querySelector(".house").textContent = student.house;
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field='squad']").dataset.squad = student.squad;
  clone.querySelector("[data-field='expel']").dataset.expel = student.expel;

  //clone.querySelector(".student_img").src = `images/${student.lastname.toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  clone.querySelector(
    ".student_img"
  ).src = `image/${student.firstname.toLowerCase()}_.png`;
  clone.querySelector(".img_container").addEventListener("click", modal);
  clone
    .querySelector("[data-field=expel]")
    .addEventListener("click", function() {
      expelStudent(student);
    });
  clone
    .querySelector("[data-field=squad]")
    .addEventListener("click", clickSquad);
  clone
    .querySelector("[data-field=prefect]")
    .addEventListener("click", function() {
      togglePrefect(student);
    });

  // append clone to list
  document.querySelector("#studentlist").appendChild(clone);

  //toggle squad
  function clickSquad() {
    toggleSquad(student);
  }
  function toggleSquad(student) {
    student.squad = student.squad === "false" ? "true" : "false";
    displayList(allStudents);
  }

  //prefect modal
  function togglePrefect(thisStudent) {
    const totalPrefects = allStudents.filter(student =>
      student.prefect === "true" ? true : false
    );
    const sameTypeHouses = totalPrefects.filter(student =>
      student.house === thisStudent.house ? true : false
    );
    console.log(sameTypeHouses.length);

    if (thisStudent.prefect === "true") {
      thisStudent.prefect = "false";
      displayList(allStudents);
    } else if (
      totalPrefects.some(prefect => prefect.house === thisStudent.house)
    ) {
      console.log("two of same kind");
      callAlertSameHouse(sameTypeHouses[0], thisStudent);
    } else if (totalPrefects.length === 2) {
      console.log("more than two");
      callAlertMoreThan2(totalPrefects, thisStudent);
    } else {
      thisStudent.prefect = "true";
      displayList(allStudents);
    }
  }
  function callAlertMoreThan2(prefects, newPrefect) {
    document.querySelector("#onlysixprefects").classList.add("show");

    for (let i = 0; i < 2; i++) {
      document.querySelector(
        `.student${1 + i}`
      ).textContent = `${prefects[i].firstname}, ${prefects[i].house}`;
    }
    removeButton(prefects, newPrefect);
  }
  function callAlertSameHouse(sameHouse, newPrefect) {
    document.querySelector("#onlyonehouse").classList.add("show");
    document.querySelector(
      "#onlyonehouse .student1"
    ).textContent = `${sameHouse.firstname},  ${sameHouse.house}`;
    document
      .querySelector("#onlyonehouse [data-action=remove1]")
      .addEventListener("click", removeCurrentPrefect);
    document
      .querySelector("#onlyonehouse.closebutton")
      .addEventListener("click", keepCurrentPrefect);
    function removeCurrentPrefect() {
      sameHouse.prefect = "false";
      newPrefect.prefect = "true";
      displayList(allStudents);
      document.querySelector("#onlyonehouse").classList.remove("show");
      document
        .querySelector("#onlyonehouse[data-action=remove1]")
        .removeEventListener("click", removeCurrentPrefect);
      document
        .querySelector("#onlyonehouse .closebutton")
        .removeEventListener("click", keepCurrentPrefect);
    }
    function keepCurrentPrefect() {
      console.log("do nothing");
      document.querySelector("#onlyonehouse").classList.remove("show");
      document
        .querySelector("#onlyonehouse [data-action=remove1]")
        .removeEventListener("click", removeCurrentPrefect);
      document
        .querySelector("#onlyonehouse .closebutton")
        .removeEventListener("click", keepCurrentPrefect);
    }
  }
  function removeButton(prefects, newPrefect) {
    const removeBtnArray = [
      document.querySelector(`[data-action=remove1`),
      document.querySelector(`[data-action=remove2`)
    ];
    removeBtnArray[0].addEventListener("click", removeFirst);
    removeBtnArray[1].addEventListener("click", removeSecond);
    function removeFirst() {
      prefects[0].prefect = "false";
      document.querySelector("#onlysixprefects").classList.remove("show");
      console.log(`remove ${prefects[0].firstname}`);
      newPrefect.prefect = "true";
      displayList(allStudents);
      removeBtnArray[0].removeEventListener("click", removeFirst);
      removeBtnArray[1].removeEventListener("click", removeSecond);
    }
    function removeSecond() {
      prefects[1].prefect = "false";
      document.querySelector("#onlysixprefects").classList.remove("show");
      console.log(`remove ${prefects[1].firstname}`);
      newPrefect.prefect = "true";
      displayList(allStudents);
      removeBtnArray[0].removeEventListener("click", removeFirst);
      removeBtnArray[1].removeEventListener("click", removeSecond);
    }
    document.querySelector(".closebutton").addEventListener("click", () => {
      document.querySelector("#onlysixprefects").classList.remove("show");
      removeBtnArray[0].removeEventListener("click", removeFirst);
      removeBtnArray[1].removeEventListener("click", removeSecond);
    });
  }
  //student modal
  function modal() {
    let modal = document.querySelector(".modal");
    let expelStud = modal.querySelector("#modal-expel");

    if (student.expel == false) {
      expelStud.textContent = "Student: Active";
    } else {
      expelStud.textContent = "Student: Expelled";
    }

    modal.querySelector("#modal-firstname").textContent = student.firstname;
    modal.querySelector("#modal-middlename").textContent = student.middlename;
    modal.querySelector("#modal-lastname").textContent = student.lastname;
    modal.querySelector("[data-field='squad']").dataset.squad = student.squad;
    modal.querySelector("#modal-gender").textContent =
      "Gender: " + student.gender;
    modal.querySelector(
      ".modal-img"
    ).src = `image/${student.firstname.toLowerCase()}_.png`;
    modal.querySelector(".modal-house").textContent = student.house;
    modal.dataset.house = student.house;
    modal
      .querySelector("object")
      .setAttribute("data", "img/" + student.house + ".png");
    console.log("img/" + student.house + ".png");
    modal
      .querySelector("[data-field=squad]")
      .addEventListener("click", clickSquad);
    var modalBg = document.querySelector(".modal-bg");
    modalBg.classList.remove("hide");
    modalBg.addEventListener("click", e => {
      closeModal();
    });
  }
}
//close modal
function closeModal() {
  let modalBg = document.querySelector(".modal-bg");
  modalBg.classList.add("hide");
  document
    .querySelector("[data-field=squad]")
    .removeEventListener("click", clickSquad);
}
//squad toggle
function clickSquad() {
  toggleSquad(student);
}
function toggleSquad(student) {
  student.squad = student.squad === "false" ? "true" : "false";
  displayList(allStudents);
}

//hacking function
function hackTheSystem() {
  console.log("hacking");
  systemHacked = true;
  console.log(systemHacked);

  const myself = Object.create(Student);

  myself.firstname = "Tram Anh";
  myself.middlename = "Ngoc";
  myself.lastname = "Tran";
  myself.house = "Unicorn";
  myself.gender = "Girl";

  allStudents.push(myself);
  console.log(myself);
}
