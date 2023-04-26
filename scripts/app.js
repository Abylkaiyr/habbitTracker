"use strict";

let habbits = [];

const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbidId;

/* page */

const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    nextDay: document.querySelector(".habbit__day"),
  },
  popupMenu: document.querySelector(".cover"),
};
/* utils */

function togglePopup() {
  if (page.popupMenu.classList.contains("cover_hidden")) {
    page.popupMenu.classList.remove("cover_hidden");
  } else {
    page.popupMenu.classList.add("cover_hidden");
  }
}

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* render */

function rerenderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }

  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);

    if (!existed) {
      const element = document.createElement("button");

      element.setAttribute("menu-habbit-id", habbit.id);

      element.classList.add("menu__item");
      element.addEventListener("click", () => rerender(habbit.id));
      element.innerHTML = `<img src="./images/${habbit.icon}.png" alt="${habbit.name}" />`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}

function rerenderHead(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = progress.toFixed(0) + "%";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerenderContent(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.content.daysContainer.innerHTML = "";
  for (const index in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = ` <div class="habbit__day">День ${
      Number(index) + 1
    }</div>
    <div class="habbit__comment">
      ${activeHabbit.days[index].comment}
    </div>
    <button class="habbit__delete" onclick="deleteComment(event)" type="submit">
      <img src="/images/icons8-delete-30.png" alt="delete day ${
        Number(index) + 1
      }" />
    </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  globalActiveHabbidId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

// work with days
function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
  }

  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbidId) {
      return {
        ...habbit,
        days: habbit.days.concat([
          {
            comment,
          },
        ]),
      };
    }
    return habbit;
  });

  form["comment"].value = "";
  rerender(globalActiveHabbidId);
  saveData();
}

function deleteComment(event) {
  const dayText = event.target.alt;
  const commentDay = dayText.match(/[0-9]+$/); // commentDay[0] --> san
  habbits[globalActiveHabbidId - 1].days.splice(commentDay[0] - 1, 1);
  rerender(globalActiveHabbidId);
  saveData();
}


// working with habits

function setIcon(icon){

}

/* init */
(() => {
  loadData();
  rerender(habbits[0].id);
})();
