
  
  class Block {
    constructor(id, form) {
      this.id = id;
      this.form = form;
    }
  }
  
  const GetBlockDescr = (blockFormArr) => {
    let depth = blockFormArr.indexOf(blockFormArr.find((x) => !x.includes(0)));
    return blockFormArr.slice(0, depth);
  };
  
  const AddNewBlockToLayout = (block, LayoutResult) => {
    block.used = true;
    let nweBlock = {
      blockId: block.id,
      position: LayoutResult.length + 1,
      isRotated: block.isRotated,
    };
    LayoutResult.push(nweBlock);
  
    return LayoutResult;
  };
  

  // Основная функция
  module.exports = function layout(blocksArr) {
    let LayoutResult = [];
  
    // список объектов-блоков
    let newBlocks = {};
    blocksArr.forEach((block) => {
      let myBlock = {
        id: block.id,
        top: [],
        bot: [],
        used: false,
        isRotated: false,
      };
  
      myBlock.top = GetBlockDescr(block.form);
      myBlock.bot = GetBlockDescr(block.form.slice().reverse()).reverse();
      newBlocks[block.id] = myBlock;
    });
  
    // найти первый блок с ровным дном
    let firstBlock = Object.values(newBlocks).find((bl) => bl.bot.length == 0);
    if (!firstBlock) {
      firstBlock = Object.values(newBlocks).find((bl) => bl.top.length == 0);
      if (firstBlock) {
        firstBlock.isRotated = true;
      }
    }
  
    LayoutResult = AddNewBlockToLayout(firstBlock, LayoutResult);
  
    // перебрать оставшиеся блоки
    let blocksLeft = Object.values(newBlocks).filter((bl) => !bl.used).length;
    let counter = 0;
    let topBlock = firstBlock;
    while (blocksLeft > 0 && counter <= blocksLeft) {
      // форма верхнего блока
      let topBlockForm = topBlock.isRotated ? topBlock.bot : topBlock.top;
  
      // подбор блоков такой же глубины формы
      let curentDepth = topBlockForm.length;
      let suitedBlocksArr = Object.values(newBlocks)
        .filter((x) => !x.used)
        .filter((x) => {
          if (x.top.length == curentDepth || x.bot.length == curentDepth)
            return true;
        });
  
      // поиск первого подходящего блока по форме
      let suitedBlock = suitedBlocksArr.find((bl) =>
        CheckBlocksForms(bl, topBlockForm)
      );
      // если найден, сделать его самым верхним
      if (suitedBlock) {
        LayoutResult = AddNewBlockToLayout(suitedBlock, LayoutResult);
        topBlock = suitedBlock;
        blocksLeft--;
      }
      counter++;
    }
  
    console.log(
      "Размещено блоков  " +
        Object.values(newBlocks).filter((bl) => bl.used).length +
        " из " +
        blocksArr.length
    );
  
    LayoutResult.forEach(bl => {
      console.log(bl.blockId + '-' + bl.position + '-' + bl.isRotated) 
    });
    
    return LayoutResult
  }
  
  // проверка совмещения двух блоков
  function CheckBlocksForms(blockToCheck, currentForm) {
    let blockSuited = false;
    const formReverce = (form) => {
      form.forEach((raw) => {
        raw.reverse();
      });
      form.reverse();
      return form;
    };
  
    const aligmentCheck = (form) => {
      return (
        form.length > 0 &&
        form.length == currentForm.length &&
        !form.some((raw, i) =>
          raw.some((x, zIndex) => x == currentForm[i][zIndex])
        )
      );
    };
  
    if (aligmentCheck(blockToCheck.bot)) {
      blockSuited = true;
    } else {
      if (aligmentCheck(formReverce(JSON.parse(JSON.stringify(blockToCheck.top))))) {
        blockToCheck.isRotated = true;
        blockToCheck.bot = formReverce(blockToCheck.bot);
        blockSuited = true;
      }
    }
  
    return blockSuited;
  }