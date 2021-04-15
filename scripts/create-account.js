//START SCREEN

const startScreen = document.querySelector(".start-screen-wrapper");
const startBtn = document.querySelector(".start-btn");
const createOrShowExemplary = document.querySelector(
  ".create-or-show-example-wrapper"
);
const accountInfo = document.querySelector(".create-account-wrapper");

const words = ["your memories", "your history", "Your Timeline"];
const cursor = gsap.to(".cursor", {
  opacity: 0,
  ease: "power2.inOut",
  repeat: -1,
});
let boxTl = gsap.timeline();

boxTl.from(".hi", {
  duration: 1,
  delay: 0.5,
  y: "7vw",
  ease: "power3.out",
  onComplete: () => {
    masterTl.play();
  },
});

let masterTl = gsap.timeline({ repeat: -1 }).pause();

words.forEach((word) => {
  let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
  tl.to(".text", { duration: 1, text: word });
  masterTl.add(tl);
});

gsap.to(startBtn, { duration: 2, opacity: 1, delay: 10 });

startBtn.addEventListener("click", () => {
  gsap.to(startScreen, { duration: 1, ease: "none", y: -700, display: "none" });
  gsap.to(createOrShowExemplary, {
    duration: 1,
    display: "flex",
    ease: "none",
    opacity: 1,
    delay: 1,
  });
});

//CHOICE BETWEEN CREATE ACCOUNT OR SHOW EXEMPLARY NBA TIMELINE

const newAccountBtn = document.querySelector(".new-account-btn");
const showExemplaryBtn = document.querySelector(".show-exemplary-btn");

async function sendHttpRequest(method, url, headers, data) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: data,
    });
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return response.json().then((errData) => {
        console.log(errData);
        throw new Error("Something went wrong - server-side");
      });
    }
  } catch (error) {
    console.log(errData);
    throw new Error("Something went wrong!");
  }
}

async function createNBATimeline() {
  try {
    for (let i = 1; i <= 30; i++) {
      const responseData = await sendHttpRequest(
        "GET",
        `https://free-nba.p.rapidapi.com/games/${i}`,
        {
          "x-rapidapi-key":
            "1025f1cd61msh0f812df9d32f1b7p17ee61jsn13bb88e9e271",
          "x-rapidapi-host": "free-nba.p.rapidapi.com",
        }
      );

      //there are no draws in NBA. so there are only 2 cases
      const winnerTeam =
        +responseData.home_team_score > +responseData.visitor_team_score
          ? responseData.home_team.name
          : responseData.visitor_team.name;

      if (i === 1) {
        createFirstTimelineElement(
          responseData.home_team.name + " vs " + responseData.visitor_team.name,
          responseData.date.substring(0, 10),
          `Game won by ${winnerTeam}. Final score was ${+responseData.home_team_score} : ${+responseData.visitor_team_score}. Great game held in ${
            responseData.home_team.city
          }. That's why we love NBA so much!`
        );
      } else {
        timelineElementCreator(
          responseData.home_team.name + " vs " + responseData.visitor_team.name,
          responseData.date.substring(0, 10),
          `Game won by ${winnerTeam}. Final score was ${+responseData.home_team_score} : ${+responseData.visitor_team_score}. Great game held in ${
            responseData.home_team.city
          }. That's why we love NBA so much!`
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

newAccountBtn.addEventListener("click", () => {
  gsap.to(createOrShowExemplary, {
    duration: 1,
    display: "none",
    opacity: 0,
  });
  gsap.to(accountInfo, {
    duration: 1,
    display: "flex",
    opacity: 1,
    delay: 1,
  });
});

showExemplaryBtn.addEventListener("click", () => {
  gsap.to(createOrShowExemplary, {
    duration: 1,
    display: "none",
    ease: "none",
    opacity: 0,
  });

  //due to style issue start and login background must be deactivated before showing any timeline

  gsap.to(".start-login-wrapper", {
    duration: 0,
    display: "none",
    ease: "none",
    opacity: 0,
  });

  gsap.to(".timeline-window-wrapper", {
    duration: 1,
    display: "block",
    opacity: 1,
    delay: 1,
  });

  createNBATimeline();
});

//CREATE ACCOUNT SCREEN

const crateAccountBtn = document.querySelector(".create-account-btn");
const nameInput = document.querySelector(".name-input");
const usernameInput = document.querySelector(".username-input");
const birthInput = document.querySelector(".birth-input");
const passwordInput = document.querySelector(".password-input");
const confirmPasswordInput = document.querySelector(".confirm-password-input");
const validationInfo = document.querySelector(".validation-info");

class Account {
  constructor(name, username, dateOfBirth, password) {
    this.name = name;
    this.username = username;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
    this.id = Math.random();
  }
}

//Validation

function isCharacterALetter(char) {
  return /[a-zA-Z]/.test(char);
}

const checkIfContainsDigit = (text) => {
  digits = [];
  for (char of text) {
    if (isNaN(char) === false) {
      digits.push(char);
    }
  }
  if (digits.length) {
    return true;
  } else {
    return false;
  }
};

const checkIfContainsUpperLetter = (text) => {
  digits = [];
  for (char of text) {
    if (isCharacterALetter(char) && char === char.toUpperCase()) {
      digits.push(char);
    }
  }
  if (digits.length) {
    return true;
  } else {
    return false;
  }
};

const passwordValidation = () => {
  if (passwordInput.value !== confirmPasswordInput.value) {
    validationInfo.textContent = "Passwords must match!";
    validationInfo.style.color = "red";
    return false;
  } else if (
    passwordInput.value.length < 8 ||
    !checkIfContainsDigit(passwordInput.value) ||
    !checkIfContainsUpperLetter(passwordInput.value)
  ) {
    validationInfo.style.color = "red";
    validationInfo.textContent =
      "Passwords must contain at least one number, one upper letter and be at least 8 characters long!";
    return false;
  } else {
    return true;
  }
};

const nameAndUsernameValidation = () => {
  if (
    nameInput.value.trim().length === 0 ||
    usernameInput.value.trim().length === 0
  ) {
    validationInfo.textContent =
      "Please make sure that name and username are entered!";
    validationInfo.style.color = "red";
    return false;
  } else {
    return true;
  }
};

const accounts = [];
let usernamesArray = [];

crateAccountBtn.addEventListener("click", () => {
  if (nameAndUsernameValidation() && passwordValidation()) {
    validationInfo.textContent = "All good! :)";
    validationInfo.style.color = "green";
    accounts.push(
      new Account(
        nameInput.value,
        usernameInput.value,
        birthInput.value,
        passwordInput.value
      )
    );
    gsap.to(".create-account-wrapper", {
      duration: 1,
      ease: "none",
      y: -700,
      opacity: 0,
      display: "none",
    });
    gsap.to(".login-wrapper", {
      duration: 1,
      ease: "none",
      display: "flex",
      opacity: 1,
      delay: 1,
    });
  } else {
    return;
  }
  usernamesArray = accounts.map((account) => account.username);
});

//Login Screen//

const loginUsername = document.querySelector(".username-login-input");
const loginPassword = document.querySelector(".password-login-input");
const loginBtn = document.querySelector(".login-button");
const loginValidationText = document.querySelector(".login-validation-wrapper");
let logedInUser;

const userNameLoginValidation = () => {
  if (usernamesArray.includes(loginUsername.value.trim())) {
    return true;
  } else {
    loginValidationText.textContent = `User ${loginUsername.value.trim()} does not exist!`;
    loginValidationText.style.color = "red";
    return false;
  }
};

const getPasswordFromUsername = () => {
  for (user of accounts) {
    if (user.username === loginUsername.value.trim()) {
      return user.password;
    }
  }
};

loginBtn.addEventListener("click", () => {
  if (userNameLoginValidation()) {
    if (loginPassword.value !== getPasswordFromUsername()) {
      loginValidationText.textContent = "Incorrect password! :(";
      loginValidationText.style.color = "red";
    } else {
      //loop that sets user as logged user
      for (user of accounts) {
        if (user.username === loginUsername.value.trim()) {
          logedInUser = user;
        }
      }

      console.log(`Welcome ${logedInUser.username}!`);
      console.log("You are ready to log in!");
      gsap.to(".login-wrapper", {
        duration: 1,
        ease: "none",
        y: -700,
        opacity: 0,
        display: "none",
      });

      //due to style issue start and login background must be deactivated before showing any timeline

      gsap.to(".start-login-wrapper", {
        duration: 0,
        display: "none",
        ease: "none",
        opacity: 0,
      });

      gsap.to(".timeline-window-wrapper", {
        duration: 1,
        ease: "none",
        opacity: 1,
        display: "block",
      });

      loginValidationText.textContent = "All good! :)";
      loginValidationText.style.color = "green";

      //function createfirstTimelineElement is created later, to make every variable origin clear!
    }
  }
  createFirstTimelineElement(
    `The day ${logedInUser.name} was born!`,
    logedInUser.dateOfBirth,
    `What a year that was! It couldn't be differente, because on this day ${logedInUser.name} was born!`
  );
});

//Timeline screen
const timeline = document.querySelector(".timeline-list");

const createTimelineElementButton = document.querySelector(
  ".create-timeline-element-btn"
);

const submitTimlineElementButton = document.querySelector(
  ".submit-timline-element-btn"
);
const newElementTitleInput = document.querySelector(".event-title-input");
const newElementDateInput = document.querySelector(".event-date-input");
const newElementDescriptionInput = document.querySelector(
  ".event-description-input"
);

const timelineElementsDataArray = [];

const createFirstTimelineElement = (title, date, description) => {
  const timelineElement = timeline.firstElementChild;
  timelineElement.querySelector("h1").textContent = title;
  timelineElement.querySelector("h4").textContent = date;
  timelineElement.querySelector("p").textContent = description;
  timelineElementsDataArray.push({
    title: title,
    date: date,
    description: description,
  });
};

const timelineElementCreator = (title, date, description) => {
  const timelineElement = timeline.firstElementChild.cloneNode(true);
  timelineElement.querySelector("h1").textContent = title;
  timelineElement.querySelector("h4").textContent = date;
  timelineElement.querySelector("p").textContent = description;
  timeline.append(timelineElement);
  timelineElementsDataArray.push({
    title: title,
    date: date,
    description: description,
  });
};

const sortTimelineElements = () => {
  var list, i, switching, b, shouldSwitch;
  list = document.querySelector(".timeline-list");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list-items:
    for (i = 0; i < b.length - 1; i++) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      /* check if the next item should
      switch place with the current item: */

      if (
        Date.parse(b[i].querySelector("h4").textContent) >
        Date.parse(b[i + 1].querySelector("h4").textContent)
      ) {
        /* if next item is numerically
        lower than current item, mark as a switch
        and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
};

submitTimlineElementButton.addEventListener("click", () => {
  timelineElementCreator(
    newElementTitleInput.value,
    newElementDateInput.value,
    newElementDescriptionInput.value
  );
  gsap.to(".modal-wrapper", {
    duration: 0.5,
    display: "none",
    ease: "none",
    opacity: 0,
  });
  gsap.to(".overlay", {
    duration: 1,
    display: "none",
    ease: "none",
    opacity: 0,
  });
  sortTimelineElements();
  console.log(timelineElementsDataArray);
});

//fill in event info

const closeModalBtn = document.querySelector(".close-modal-button");

// open modal handler

createTimelineElementButton.addEventListener("click", () => {
  gsap.to(".modal-wrapper", {
    duration: 0.5,
    display: "block",
    ease: "none",
    opacity: 1,
  });
  gsap.to(".overlay", {
    duration: 0,
    display: "block",
    ease: "none",
    opacity: 1,
  });
});

// close modal hanlder

closeModalBtn.addEventListener("click", () => {
  gsap.to(".modal-wrapper", {
    duration: 0.5,
    display: "none",
    ease: "none",
    opacity: 0,
  });
  gsap.to(".overlay", {
    duration: 1,
    display: "none",
    ease: "none",
    opacity: 0,
  });
});

//Create first timeline element with name and date of birth of an User
