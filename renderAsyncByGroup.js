module.exports = async function renderAsync(renderItems, n) {
  let outputArr = [];

  // ограничение на размер группы для рендеринга
  let groupSize = Math.min(5, n);

  // сортировка по приоритетам
  renderItems.sort((x, y) => y.priority - x.priority);

  while (renderItems.length > 0) {
    // поиск максимального приоритета
    let currentPriority = Math.max(...renderItems.map((x) => x.priority));

    // число элементов с текущим приоритетом
    let priorityGroupSize = renderItems.filter(
      (x) => x.priority == currentPriority
    ).length;

    // группа всех элементов с текущим приоритетом
    let priorityItemsGroup = renderItems.splice(0, priorityGroupSize);

    // число подгрупп для текущего приоритета
    let groupsAmount = Math.ceil(priorityItemsGroup.length / groupSize);

    // рендер групп
    for (let i = 1; i <= groupsAmount; i++) {
      // формирование группы
      let itemsSet = new Set();
      let currentGroup = priorityItemsGroup.splice(0, groupSize);
      currentGroup.forEach((item) => {
        itemsSet.add(item.render(item.id));
      });

      //рендеринг
      let resultArr = await Promise.all([...itemsSet]);

      // отчет
      outputArr.push(...resultArr);
    }
  }

  return outputArr;
};
