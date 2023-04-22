const log = console.log;
const actAttribute = "x-make";
let actionList = {};

class Element_cl {
  constructor(el, action) {
    this.html = el;
    this.act = action.split(":")[0];
    this.repeter = action.split(":")[1];
  }
}

const checkNode = (child, currentlevelCounter) => {
  let currentLevel = currentlevelCounter;
  if (child.hasAttribute(actAttribute)) {
    let act = child.getAttribute(actAttribute);
    element = new Element_cl(child, act);
    if (!actionList[currentlevelCounter]) actionList[currentlevelCounter] = [];
    actionList[currentlevelCounter].push(element);
  }

  // рекурсия, если содержит детей
  [...child.children].forEach((elementChildren) => {
    checkNode(elementChildren, currentLevel + 1);
  });
};

// действие копирования
const copyElement = (element, n) => {
  for (let i = 0; i < n; i++) {
    const newElement = element.cloneNode(true);
    element.after(newElement);
  }
};

// действие удаления
const removeElement = (element, n) => {
  for (let i = 0; i < n; i++) {
    if (element.nextElementSibling) {
      const ElementToRemove = element.nextElementSibling;
      ElementToRemove.remove();
    } else {
      return;
    }
  }
};

// действие удаления потомков
const removeChildren = (element, n) => {
  for (let i = 0; i < n; i++) {
    const ElementToRemove = element.firstElementChild;
    element.removeChild(ElementToRemove);
  }
};

// действие замены
const swapElements = (element, n) => {
  let elementForReplace = element.nextElementSibling;
  for (let i = 0; i < n - 1; i++) {
    if (elementForReplace.nextElementSibling) {
      elementForReplace = elementForReplace.nextElementSibling;
    } else {
      elementForReplace = elementForReplace.parentElement.firstElementChild;
    }
  }

  if (element != elementForReplace) {
    let beforAncer = true;
    let ancer;
    if (elementForReplace.nextElementSibling) {
      ancer = elementForReplace.nextElementSibling;
    } else {
      ancer = elementForReplace.previousElementSibling;
      beforAncer = false;
    }

    element.parentElement.insertBefore(elementForReplace, element);
    if (beforAncer) {
      ancer.parentElement.insertBefore(element, ancer);
    } else {
      element.parentElement.appendChild(element);
    }
  }
};

const updateActionList = (entryPoint) => {
  actionList = {};
  const nodeChildren = [...entrypoint.children];
  let levelCounter = 1;

  nodeChildren.forEach((child) => {
    checkNode(child, levelCounter);
  });
};


function solution(entryPoint) { 
  updateActionList(entryPoint);

  // Перебор всего набора действий
  for (level in actionList) {
    for (let act of actionList[level].filter((x) => x.act == "copy")) {
      act.html.removeAttribute(actAttribute);
      copyElement(act.html, act.repeter);
    }

    for (let act of actionList[level].filter((x) => x.act == "remove")) {
      act.html.removeAttribute(actAttribute);
      removeElement(act.html, act.repeter);
    }
    for (let act of actionList[level].filter(
      (x) => x.act == "removeChildren"
    )) {
      act.html.removeAttribute(actAttribute);
      removeChildren(act.html, act.repeter);
    }
    for (let act of actionList[level].filter((x) => x.act == "switch")) {
      act.html.removeAttribute(actAttribute);
      swapElements(act.html, act.repeter);
    }

    updateActionList();
    log(actionList);
  }
};
