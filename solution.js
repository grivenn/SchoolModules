


export function getObserverCallback(updateBreadcrumbs, currentHeader = null) {
  // решение
  if (currentHeader == null) return;

  let BreadcrumbsArr = [];
  let allHeadersList = {};
  allHeadersList = parse(allHeadersList);

  let parentId = currentHeader;
  let headerLevel = document.getElementById(currentHeader).dataset.header;

  while (parentId > 0) {
    let id = parentId;
    let nextHd = allHeadersList[headerLevel][id];
    parentId = nextHd.parentId;
    headerLevel = nextHd.parentLevel;
    BreadcrumbsArr.push(id);
  }
  BreadcrumbsArr.push(0);

  BreadcrumbsArr.reverse();
  updateBreadcrumbs(BreadcrumbsArr);
}


// =====================================================================================
// парсинг div[data-header]

// Думаю, что по уму, результат парсинга надо где-то кэшировать, что бы не перелопачивать его каждый раз.

function parse(allHeadersList) {
    let parentId = 0;
    let parentLevel = 1;
    let stec = [0];
    let oldElID = 0;
    let oldElLevel = 0;
  
    let newElID = 0;
    let newElLevel = 0;
  
    document.querySelectorAll("div[data-header]").forEach((el) => {
      oldElID = newElID;
      oldElLevel = newElLevel;
  
      newElID = Number(el.id);
      newElLevel = Number(el.dataset.header);
  
      // снижение
      if (newElLevel - oldElLevel < 0) {
        let steps = oldElLevel - newElLevel;
        [parentId, parentLevel] = stec.splice(stec.length - steps, steps).shift();
      }
      // подъем
      else if (newElLevel - oldElLevel > 0) {
        stec.push([parentId, parentLevel]);
        parentId = oldElID;
        parentLevel = oldElLevel;
      }
  
      if (!allHeadersList[newElLevel]) {
        allHeadersList[newElLevel] = {};
      }
  
      allHeadersList[newElLevel][newElID] = {
        parentId: parentId,
        parentLevel: parentLevel,
      };
    });
  
    return allHeadersList;
  }