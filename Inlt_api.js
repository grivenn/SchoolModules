const log = console.log;
const logR = (tRes, res) => console.log(`${tRes}   =>    ${res}`);
let result, testResult


// Tests
//  =======================================================================


//       @ global
let stringTokens = ["key", " ", "$var", " ", "#translation"];
let variables = { var: 100  };
let translations = {
  "ru-RU": { translation: "тест" },
  "en-US": { translation: "test" },
  "de-DE": { translation: "prüfen" },
  "hi-IN": { translation: "परीक्षा" },
  "ar-AA": { translation: "امتحان" },
};
let locale = 'ar-AA'

let testResults = {
  "ru-RU": "key 100 тест",
  "en-US": "key 100 test",
  "de-DE": "key 100 prüfen",
  "hi-IN": "key 100 परीक्षा",
  "ar-AA": "100 امتحان"
}

Object.keys(testResults).forEach(key => {  
  result = getI18nText({ stringTokens, variables, translations, locale: key});
  testResult = testResults[key]
  logR(testResult, result);
});



// //  =======================================================================
// //     @list
result = getI18nText({
  stringTokens: [["@list", "Motorcycle", "$item", "#bus"]],
  variables: { item: "Car" },
  translations: {
    "en-US": {
      bus: "Bus",
    }
  },
  locale: "en-US",
});  
testResult = 'Motorcycle, Car, and Bus'
logR(testResult, result);



// //  =======================================================================
// //    @relativeTime
// //Сигнатура: "@relativeTime(value, unit)"

result = getI18nText({
  stringTokens: [["@relativeTime", -5, "hours"]],
  locale: "ru-RU",
}); 
testResult = '5 часов назад'
logR(testResult, result);



// //  =======================================================================
// //      @plural
result = getI18nText({  
  stringTokens: [["@plural", "#day", "$tripDays"]],  
  variables: { tripDays: 434.5 },  
  translations: {  
    "ru-RU": {  
      day: {  
        zero: " дней",  
        one: " день",  
        few: " дня",  
        many: " дней",  
        other: " дней",  
      },  
    }    
  },  
  locale: "ru-RU",  
}) 
testResult = "434,5 дня"
logR(testResult, result);



// //  =======================================================================
// //      @number
result = getI18nText({stringTokens: [["@number", 56789.01, "USD"]], locale: "ru-RU",  }) 
// let result = getI18nText({stringTokens: [["@number", 56789.01, "GBP"]], locale: "en-GB",  }) 
testResult = '56 789,01 $'
logR(testResult, result);




// //  =======================================================================
// //      @date
result = getI18nText({    stringTokens: [["@date", 1676561884561]],    locale: "ru-RU",  }) 
testResult = 'четверг, 16 февраля 2023 г., 15:38:04 UTC'
logR(testResult, result);


//  ======================================================================================================
//  ======================================================================================================
//  ======================================================================================================
//  ======================================================================================================

export function getI18nText(inputData) {
  let stringTokens = inputData["stringTokens"];
  let variables = inputData["variables"];
  let translations = inputData["translations"];
  let local = inputData["locale"];

  // Functions ======================================================================================================
  const getVars = (arr) =>
    arr.map((x) =>
      typeof x === "string" && x.includes("$")
        ? variables[x.replace("$", "")]
        : x
    );

  const getTrans = (arr) =>
    arr.map((x) =>
      typeof x === "string" && x.includes("#")
        ? translations[local][x.replace("#", "")]
        : x
    );

  // @list
  const list = (items) => {
    const formatter = new Intl.ListFormat(local);
    return formatter.format(items);
  };

  //@relativeTime
  const relativeTime = (items) => {
    const formatter = new Intl.RelativeTimeFormat(local);
    return formatter.format(...items);
  };

  // @number
  const number = (items) => {
    const [num, currency] = items
    const formatter = new Intl.NumberFormat(local, { style: 'currency', currency: currency });
    return formatter.format(num);
  }

  //@plural
  const plural = (items) => {
    let [plur, num] = items

    const formatter = new Intl.PluralRules(local);
    const rule = formatter.select(Math.floor(num));
    return `${num}${plur[rule]}`
  };

  //@date
  const date = (items) => {
    return new Intl.DateTimeFormat(local, {dateStyle: 'full', timeStyle: 'long', timeZone: 'UTC' }).format(items);
  };

  // ==================================================================================================

  // заменить все переменные и функции
  stringTokens = getVars(stringTokens);
  stringTokens = getTrans(stringTokens);

  stringTokens = stringTokens.map((x) => {
    // если массив, то это функция
    if (Array.isArray(x)) {
      x = getVars(x);
      x = getTrans(x);

      let [func, ...args] = x;
      return eval(`${func.replace("@", "")}(${JSON.stringify(args)})`);
    }
    return x;
  });

  return stringTokens.reduce((str, x) =>{ return `${str}${x}`})
}

