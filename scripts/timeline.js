//Your Timeline is a single page application using gsap animations

//START SCREEN
const startScreen = document.querySelector(".start-screen-wrapper");

//Button displayed after 10 seconds with text: 'click to start'
const startBtn = document.querySelector(".start-btn");

//animation with words visible at the start
const words = ["your memories", "your history", "Your Timeline"];
const cursor = gsap.to(".cursor", {
  opacity: 0,
  ease: "power2.inOut",
  repeat: -1,
});

let boxTl = gsap.timeline();

//words in start screen without typing animation
boxTl.from(".hi", {
  duration: 1,
  delay: 0.5,
  y: "7vw",
  ease: "power3.out",
  onComplete: () => {
    masterTl.play();
  },
});

//repeat -1 makes this animation infinite
let masterTl = gsap.timeline({ repeat: -1 }).pause();

//words with typing animation
words.forEach((word) => {
  let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
  tl.to(".text", { duration: 1, text: word });
  masterTl.add(tl);
});

//animation that shows start button after 10 seconds, after words: 'Your Timeline' are displayed
gsap.to(startBtn, { duration: 2, opacity: 1, delay: 10 });

//this is next view, that startBtn will take the user to, where user can choose between options: crate account (start your timeline journey) or show exemplary NBA timeline
const createOrShowExemplary = document.querySelector(
  ".create-or-show-example-wrapper"
);

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
//It is named "createOrShowExemplary"
const newAccountBtn = document.querySelector(".new-account-btn");
const showExemplaryBtn = document.querySelector(".show-exemplary-btn");

//view that lets user create new account
const accountInfo = document.querySelector(".create-account-wrapper");

//If you choose to start Your Timeline journey, you will be taken to accountInfo view (by clilcking start Your Timeline journey Btn), which lets you create new accout
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

//If you choose to show exemplary Timeline, you will be taken to exemplary NBA timeline (that uses data from external API) view (by clilcking start Your Timeline journey Btn)
showExemplaryBtn.addEventListener("click", () => {
  clearTimeline();
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
  createNBATimeline(); //this function is declared later in CREATION AND NAVIGATION IN EXEMPLARY NBA TIMELINE sector
});

//CREATION AND NAVIGATION IN EXEMPLARY NBA TIMELINE

//function to handle any http Request
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

/*function that fetches data from external API and creates timeline elements using 
functions createFirstTimelineElement and timelineElementCreator, that are declered in TIMELINE sector*/
async function createNBATimeline() {
  try {
    //as an example this function loads 30 games, but it can work with any namber of elements
    //as projects grows, this function will we changed, to load data from database and load timelines saved by users
    for (let i = 1; i <= 30; i++) {
      const loadingPercent = document.getElementById("loading-percent"); //fetching progress shown in percent

      //loading animation
      gsap.to(".loading-screen-wrapper", {
        duration: 1,
        display: "flex",
        opacity: 1,
        delay: 0.3,
      });

      //for every iteration percent number grows, until it reaches 100, when fetching is completed

      loadingPercent.textContent = `${Math.floor((i / 30) * 100)}%`;

      const responseData = await sendHttpRequest(
        "GET",
        `https://free-nba.p.rapidapi.com/games/${i}`,
        {
          "x-rapidapi-key":
            "1025f1cd61msh0f812df9d32f1b7p17ee61jsn13bb88e9e271",
          "x-rapidapi-host": "free-nba.p.rapidapi.com", //That is my key, I don't want every user to generate a new one, it's just to present working with API and JSON data
        }
      );

      //variable that stores game winner
      //there are no draws in NBA. so there are only 2 cases
      const winnerTeam =
        +responseData.home_team_score > +responseData.visitor_team_score
          ? responseData.home_team.name
          : responseData.visitor_team.name;

      //timeline elements are clones of first element with changed data, so we have to generate first element separatly
      if (i === 1) {
        //function declared in TIMELINE sector
        createFirstTimelineElement(
          responseData.home_team.name + " vs " + responseData.visitor_team.name,
          responseData.date.substring(0, 10),
          `Game won by ${winnerTeam}. Final score was ${+responseData.home_team_score} : ${+responseData.visitor_team_score}. Great game held in ${
            responseData.home_team.city
          }. That's why we love NBA so much!`
        );
      } else {
        //function declared in TIMELINE sector
        timelineElementCreator(
          responseData.home_team.name + " vs " + responseData.visitor_team.name,
          responseData.date.substring(0, 10),
          `Game won by ${winnerTeam}. Final score was ${+responseData.home_team_score} : ${+responseData.visitor_team_score}. Great game held in ${
            responseData.home_team.city
          }. That's why we love NBA so much!`
        );
      }
    }

    //animation that hides loading screen when fetching is completed
    gsap.to(".loading-screen-wrapper", {
      duration: 1,
      display: "none",
      opacity: 0,
    });
    gsap.to(".timeline-window-wrapper", {
      duration: 1,
      display: "block",
      opacity: 1,
      delay: 1,
    });
  } catch (error) {
    console.log(error.message);
  }
}

//navigation inside exemplary NBA timeline
//create account option only occurs in exemplary timeline, it won't be visable, when user is already logged in
const createAccountFromExemplaryTimelineBtn = document.querySelector(
  ".create-account-from-exemplary-timeline-btn"
);

//animation from exemplary Timeline view to create account view

createAccountFromExemplaryTimelineBtn.addEventListener("click", () => {
  gsap.to(".timeline-window-wrapper", {
    duration: 1,
    display: "none",
    opacity: 0,
    delay: 0.3,
  });
  gsap.to(accountInfo, {
    duration: 1,
    display: "flex",
    opacity: 1,
    delay: 1,
  });

  //due to style issue start and login background must be deactivated before showing any timeline
  gsap.to(".start-login-wrapper", {
    duration: 0,
    display: "flex",
    ease: "none",
    opacity: 1,
  });
});

//CREATE ACCOUNT SCREEN
const crateAccountBtn = document.querySelector(".create-account-btn");

const goBackFromCreateAccoutBtn = document.querySelector(
  ".go-back-from-create-account-button"
); //takes you back to choice between creating account and showing exemplary NBA timeline

//inputs
const nameInput = document.querySelector(".name-input");
const usernameInput = document.querySelector(".username-input");
const birthInput = document.querySelector(".birth-input");
const passwordInput = document.querySelector(".password-input");
const confirmPasswordInput = document.querySelector(".confirm-password-input");

const validationInfo = document.querySelector(".validation-info"); //text that shows if all inputs are valid

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

//checks if given character is a letter
function isCharacterALetter(char) {
  return /[a-zA-Z]/.test(char);
}

//password has to be at least 8 chars long, contain at least one upper letter and one digit
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

//function that checks all validation conditions
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

//name and username cannot be empty
//trim is used in case of user accidentally uses space before or after their input
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

//you cannot be born before 1903 and after current date in order to create account.
//The oldest person in the world is 117-year-old Kane Tanaka of Japa and was born in 1903 (second of January)
const dateValidation = () => {
  if (
    Date.parse(birthInput.value) > new Date() || //new Date () returns current date! :)
    Date.parse(birthInput.value) < Date.parse("1903-01-02")
  ) {
    validationInfo.textContent =
      "You are immortal or come from a future ;) Enter valid date of birth!";
    validationInfo.style.color = "red";
    return false;
  } else if (birthInput.value === '') {
    validationInfo.textContent =
    "Please provide your birth date.";
    validationInfo.style.color = "red";
    return false;
  } else {
    return true;
  }
};

//there is no database yet, there will be function, that checks if Username already exist added with it

//takes you back to choice between creating account and showing exemplary NBA timeline
goBackFromCreateAccoutBtn.addEventListener("click", () => {
  gsap.to(".create-account-wrapper", {
    duration: 1,
    ease: "none",
    opacity: 0,
    display: "none",
  });
  gsap.to(createOrShowExemplary, {
    duration: 1,
    ease: "none",
    display: "flex",
    opacity: 1,
    delay: 1,
  });
});

//global variables used to handle users data, and current user that is looged in

const accounts = []; //accounts will become useful, when there will be database with many users info
let usernamesArray = []; //usernameArrays stores all usernames, and is used to compare username with password, when user tries to log in later

//if all data is valid, when you click create account button, it will take you to logging in view
crateAccountBtn.addEventListener("click", () => {
  if (nameAndUsernameValidation() && passwordValidation() && dateValidation()) {
    clearTimeline(); //If you opened exemplary NBA timeline before it has to be cleared, before displaying a new one. this function is declared in TIMELINE sector
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

    //animation that takes you to logging in view
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

    //deactivates button, that lets you create account when seeing exemplary timeline, because you already have and account
    gsap.to(createAccountFromExemplaryTimelineBtn, {
      duration: 1,
      ease: "none",
      display: "none",
      opacity: 0,
    });
  } else {
    return;
  }

  //adds all usernames to array, that is later udes to check if username exists and if password matches username, when logging in
  usernamesArray = accounts.map((account) => account.username);
});

//when in any input in this view, crateAccountBtn can be triggered by clicking "enter" key
const createAccountInputs = [
  nameInput,
  usernameInput,
  birthInput,
  passwordInput,
  confirmPasswordInput,
]; //list of all inputs in this view

createAccountInputs.forEach((input) => {
  input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      crateAccountBtn.click();
    }
  });
});

//LOGGING IN SCREEN//

//inputs
const loginUsername = document.querySelector(".username-login-input");
const loginPassword = document.querySelector(".password-login-input");

const loginBtn = document.querySelector(".login-button");

//text, that shows if username doesn't exist or password is wrong
const loginValidationText = document.querySelector(".login-validation-wrapper");
let logedInUser;

//checks if username exist in accounts array
const userNameLoginValidation = () => {
  if (usernamesArray.includes(loginUsername.value.trim())) {
    return true;
  } else {
    loginValidationText.textContent = `User ${loginUsername.value.trim()} does not exist!`;
    loginValidationText.style.color = "red";
    return false;
  }
};

//returns username password
//when actually using, it can't be visible to client side!!!

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

      //info for developer, that right user is logged in
      console.log(`Welcome ${logedInUser.username}!`);

      //animation, that takes us to TIMELINE view
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
    }
  }

  //function createfirstTimelineElement Creates first timeline element with name and date of birth of an User is declared in TIMELINE sector
  createFirstTimelineElement(
    `The day ${logedInUser.name} was born!`,
    logedInUser.dateOfBirth,
    `What a year that was! It couldn't be differente, because on this day ${logedInUser.name} was born!`
  );
});

  //when in any input in this view, crateAccountBtn can be triggered by clicking "enter" key
  const loginInputs = [
    loginUsername,
    loginPassword
]; //list of all inputs in this view

loginInputs.forEach((input) => {
  input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      loginBtn.click();
    }
  });
});

//TIMELINE
const timeline = document.querySelector(".timeline-list");

const createTimelineElementButton = document.querySelector(
  ".create-timeline-element-btn"
);

//visible in modal, that opens when user creates new timeline element
const submitTimlineElementButton = document.querySelector(
  ".submit-timline-element-btn"
);
const newElementTitleInput = document.querySelector(".event-title-input");
const newElementDateInput = document.querySelector(".event-date-input");
const newElementDescriptionInput = document.querySelector(
  ".event-description-input"
);

let timelineElementsDataArray = []; //array that stores all timeline elements, it will be useful when working with database, in order to safe users timelines

//function that selects first timeline element and fills it with data
//other elements are clones of the first one, with differente text content
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

//function that clones elements from first timeline element and fills in with text content
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

//sorts Timeline Elements in order accoring to date
const sortTimelineElements = () => {
  let list, i, switching, b, shouldSwitch;
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

//claers modal inputs every time, new element is added to Your Timeline
const clearModalInputs = () => {
  (newElementTitleInput.value = ""),
    (newElementDateInput.value = ""),
    (newElementDescriptionInput.value = "");
};

//clears timeline and timelineElementsDataArray
const clearTimeline = () => {
  const limit = timeline.childElementCount - 1;
  for (let i = 0; i < limit; i++) {
    timeline.firstElementChild.remove();
  }
  timelineElementsDataArray = [];
};

//MODAL (fill in event info for timeline element you want to add)

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
  console.log(timelineElementsDataArray);
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

const modalValidationText = document.getElementById("modal-inputs-validation"); //modal validation text

//checks if no modal input is empty
const modalInputsValidation = () => {
  if (
    newElementTitleInput.value.trim() === "" ||
    newElementDescriptionInput.value.trim() === "" ||
    newElementDateInput.value.trim() === ""
  ) {
    modalValidationText.style.color = "red";
    modalValidationText.textContent = "Fields can't be empty :(!";
    return false;
  } else {
    modalValidationText.textContent =
      "Fill in event info. Title cannot be longer than 35 characters.";
    modalValidationText.style.color = "white";
    return true;
  }
};

//this button on click creates new element from data provided by user, closes modal and clears inputs
//only works if inputs aren't empty, to prevent creation of blank elements
submitTimlineElementButton.addEventListener("click", () => {
  if (modalInputsValidation()) {
    timelineElementCreator(
      newElementTitleInput.value,
      newElementDateInput.value,
      newElementDescriptionInput.value
    );
    clearModalInputs();
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
  }
});

//when in any input in this view, crateAccountBtn can be triggered by clicking "enter" key
  const modalInputs = [
    newElementTitleInput,
    newElementDateInput
]; //list of all inputs in this view except of description, enter shouldn't work there, because it makes a bug, when user want to use enter to split text

modalInputs.forEach((input) => {
  input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      submitTimlineElementButton.click();
    }
  });
});
