//Timeline screen
const timeline = document.querySelector(".timeline-list");
const timelineElement = timeline.firstElementChild.cloneNode(true);
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
    for (i = 0; i < (b.length - 1); i++) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      /* check if the next item should
      switch place with the current item: */
      
      console.log(b[i].querySelector('h4').textContent)
      
      if (Date.parse(b[i].querySelector('h4').textContent) > Date.parse(b[i + 1].querySelector('h4').textContent)) {
        
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
}

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
      timelineElementCreator(
        responseData.home_team.name + " vs " + responseData.visitor_team.name,
        responseData.date.substring(0, 10),
        `Game won by ${winnerTeam}. Final score was ${+responseData.home_team_score} : ${+responseData.visitor_team_score}. Great game held in ${
          responseData.home_team.city
        }. That's why we love NBA so much!`
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

createNBATimeline();
