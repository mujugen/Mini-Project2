var user = Array.from([JSON.parse(localStorage.getItem("finalApplicant"))]);
let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const applicantNameInput = document.getElementById("applicantNameInput");
applicantNameInput.value = user[0].name;
const interviewTimeInput = document.getElementById("interviewTimeInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventsForDay = events.filter((e) => e.date === clicked);

  if (eventsForDay.length) {
    chooseModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }

  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      const eventsForDay = events.filter((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventsForDay.length) {
        eventsForDay.forEach((eventForDay) => {
          const eventDiv = document.createElement("div");
          daySquare.style.overflowY = "auto";
          eventDiv.classList.add("event");
          eventDiv.innerText = `${eventForDay.title.name} - ${eventForDay.title.time}`;
          daySquare.appendChild(eventDiv);
        });
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  applicantNameInput.classList.remove("error");
  interviewTimeInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  interviewTimeInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (applicantNameInput.value && interviewTimeInput.value) {
    applicantNameInput.classList.remove("error");
    interviewTimeInput.classList.remove("error");

    const time = interviewTimeInput.value.split(":");
    let hours = parseInt(time[0]);
    const minutes = time[1];

    // Convert to 24-hour format
    const period = interviewTimeInput.value.slice(-2);
    if (period === "PM" && hours < 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    const eventName = {
      name: applicantNameInput.value,
      time: `${hours.toString().padStart(2, "0")}:${minutes}`,
    };

    events.push({
      date: clicked,
      title: eventName,
    });

    localStorage.setItem("events", JSON.stringify(events));
    toggleDarkOverlay("proceedCard");
    toggleGlowOverlay("proceedCard");
    closeModal();
  } else {
    if (!applicantNameInput.value) {
      applicantNameInput.classList.add("error");
    }
    if (!interviewTimeInput.value) {
      interviewTimeInput.classList.add("error");
    }
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  let eventsForDay = [];
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);

  document
    .getElementById("chooseCreateButton")
    .addEventListener("click", () => {
      chooseModal.style.display = "none";
      newEventModal.style.display = "block";
    });
  let selectedEvent = null;

  document
    .getElementById("chooseDeleteButton")
    .addEventListener("click", () => {
      chooseModal.style.display = "none";
      deleteEventModal.style.display = "block";
      const eventList = document.getElementById("eventList");
      eventList.innerHTML = "";
      eventsForDay = events.filter((e) => e.date === clicked);
      eventsForDay.forEach((eventForDay) => {
        const listItem = document.createElement("li");
        listItem.style.marginTop = "10px";
        listItem.style.marginBottom = "10px";
        listItem.addEventListener("mouseover", function () {
          listItem.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        });

        listItem.addEventListener("mouseout", function () {
          listItem.style.backgroundColor = "";
        });
        listItem.innerText = `${eventForDay.title.name} - ${eventForDay.title.time}`;
        listItem.addEventListener("click", () => {
          if (selectedEvent) {
            selectedEvent.classList.remove("selected");
          }
          listItem.classList.add("selected");
          selectedEvent = listItem;
        });
        eventList.appendChild(listItem);
      });
    });

  document.getElementById("deleteButton").addEventListener("click", () => {
    if (selectedEvent) {
      const eventForDeletion = eventsForDay.find(
        (e) => `${e.title.name} - ${e.title.time}` === selectedEvent.innerText
      );
      events.splice(events.indexOf(eventForDeletion), 1);
      localStorage.setItem("events", JSON.stringify(events));
      closeModal();
    }
  });

  document.getElementById("closeButton").addEventListener("click", closeModal);
}

function checkDateAndTime(user) {
  const eventsForUser = events.filter((e) => e.title.name === user);

  if (eventsForUser.length) {
    // Sort the events by date and time, in descending order
    eventsForUser.sort((a, b) => {
      const aDateTime = new Date(a.date + " " + a.title.time);
      const bDateTime = new Date(b.date + " " + b.title.time);
      return bDateTime - aDateTime;
    });

    const latestEvent = eventsForUser[0];
    const userDetails = {
      date: latestEvent.date,
      time: latestEvent.title.time,
      name: latestEvent.title.name,
    };

    return userDetails;
  }
  return null;
}

// Add an event listener to the proceedBtn
document.getElementById("proceedBtn").addEventListener("click", () => {
  const userDetails = checkDateAndTime(user[0].name);
  if (userDetails) {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    console.log("User details:", userDetails); // Print the userDetails object for debugging
    window.location.href = "interview-scheduler.html";
  } else {
    console.error("No event found for the user.");
  }
});

initButtons();
load();

function toggleDarkOverlay(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const existingOverlay = element.querySelector(".dark-overlay");

  if (existingOverlay) {
    existingOverlay.style.opacity = "0";
    setTimeout(() => {
      element.removeChild(existingOverlay);
      element.style.pointerEvents = "auto";
    }, 300);
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("dark-overlay");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.pointerEvents = "none";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.3s";

  const borderRadius = window.getComputedStyle(element).borderRadius;
  if (borderRadius) {
    overlay.style.borderRadius = borderRadius;
  }

  element.style.position = "relative";
  element.style.pointerEvents = "none";
  element.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = "1";
  }, 10);
}

function toggleGlowOverlay(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const existingOverlay = element.querySelector(".glow-overlay");

  if (existingOverlay) {
    element.removeChild(existingOverlay);
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("glow-overlay");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "-1";

  overlay.style.boxShadow =
    "0 0 5px rgba(113, 73, 198, 0.2), 0 0 10px rgba(113, 73, 198, 0.2), 0 0 15px rgba(113, 73, 198, 0.2), 0 0 20px rgba(113, 73, 198, 0.2), 0 0 35px rgba(113, 73, 198, 0.2), 0 0 40px rgba(113, 73, 198, 0.2), 0 0 50px rgba(113, 73, 198, 0.2)";

  const borderRadius = window.getComputedStyle(element).borderRadius;
  if (borderRadius) {
    overlay.style.borderRadius = borderRadius;
  }

  element.style.position = "relative";
  element.appendChild(overlay);
}

toggleDarkOverlay("proceedCard");
