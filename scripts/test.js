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

const timelineElementCreator = (title, date, description) => {
  const timelineElement = timeline.firstElementChild.cloneNode(true);
  timelineElement.querySelector("h1").textContent = title;
  timelineElement.querySelector("h4").textContent = date;
  timelineElement.querySelector("p").textContent = description;
  timeline.append(timelineElement);
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
      
      if (Number(b[i].querySelector('h4').textContent) > Number(b[i + 1].querySelector('h4').textContent)) {
        
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
  sortTimelineElements()
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


