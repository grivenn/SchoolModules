class CartItem {
  // articleId: number; // id товара
  // quantity: number; // количество товара в заказе
  constructor(articleId, quantity) {
    this.articleId = articleId;
    this.quantity = quantity;
  }
}

class Cart {
  // userId: number; // id пользователя
  // orderDate: string; // дата заказа в формате ISO 8601 без времени
  // items: CartItem[]; // позиции заказа
  // cityId: number; // id города доставки
  // currency: string; // код валюты заказа

  constructor(userId, orderDate, items, cityId, currency) {
    (this.userId = userId),
      (this.orderDate = orderDate),
      (this.items = items),
      (this.cityId = cityId),
      (this.currency = currency);
  }
}

class apiClient_class {
  currencyDefaultId = 10001;

  currencyList = {
    10001: "Rub",
    10002: "Eur",
    10003: "Usd",
  };

  cityIdList = {
    1001: "Москва",
    1002: "Анапа",
    1003: "Чебаркуль",
    1004: "Игарка",
  };

  deliveryPriceList = {
    1001: 100,
    1002: 200,
    1003: 300,
    1004: 400,
  };

  articleIdList = {
    100000001: "article1",
    100000002: "article2",
    100000003: "article3",
    100000004: "article4",
  };

  pricesList = {
    "2020-01-01": {
      100000001: 101,
      100000002: 201,
      100000003: 301,
      100000004: 401,
    },
    "2020-02-01": {
      100000001: 102,
      100000002: 202,
      100000003: 302,
      100000004: 402,
    },
  };

  remainsForDateList = {
    "2020-01-01": {
      100000001: { remains: 1001, partIdList: [999001, 999002, 999003] },
      100000002: { remains: 2001, partIdList: [999001, 999002, 999003] },
      100000003: { remains: 3001, partIdList: [999001, 999002, 999003] },
      100000004: { remains: 4001, partIdList: [999001, 999002, 999003] },
    },
    "2020-02-01": {
      100000001: { remains: 1002, partIdList: [999001, 999002, 999003] },
      100000002: { remains: 2002, partIdList: [999001, 999002, 999003] },
      100000003: { remains: 3002, partIdList: [999001, 999002, 999003] },
      100000004: { remains: 4002, partIdList: [999001, 999002, 999003] },
    },
  };

  ExchangeCurrencyRates = {
    10001: 1,
    10002: 20,
    10003: 30,
  };

  constructor() {}

  // Получить код валюты по умолчанию. Возвращаемое значение - строка.
  getDefaultCurrency() {
    return this.currencyDefaultId;
  }

  //Получить цены на заданную дату.
  //Входные параметры – строка с датой в формате ISO 8601 без времени.
  //Возвращаемое значение - список записей с данными о ценах.
  //Каждая запись содержит id товара (поле articleId), цену, дату актуальности цены (в формате ISO 8601 без времени) и может опционально содержать код валюты (в формате строки).
  getPrices(orderDate) {
    let priceList = {};

    Object.keys(this.articleIdList).forEach((articleId) => {
      let priceForDate = {
        articleId: articleId,
        price: this.pricesList[orderDate][articleId],
        date: orderDate,
        currencyId: 1001,
      };
      priceList[articleId] = priceForDate;
    });

    return priceList;
  }

  getPriceForArticleForDate(orderDate, article) {
    let priceForDate = 0;
    if (this.pricesList[orderDate]) {
      priceForDate = {
        articleId: article,
        price: this.pricesList[orderDate][article],
        date: orderDate,
        currencyId: 1001,
      };
    }

    return priceForDate;
  }

  // Получить остатки товара на заданную дату.
  // Входные параметры - строка с датой в формате ISO 8601 без времени.
  // Возвращаемое значение - список записей с данными об остатках.
  //Каждая запись содержит id товара (поле articleId), количество, дату остатка (в формате ISO 8601 без времени) и номер партии (в формате строки). Могут присутствовать несколько партий одного товара.
  getRemainsOnDate(date) {
    let remainsList = {};
    if (Object.keys(this.remainsForDateList).includes(date)) {
      Object.keys(this.articleIdList).forEach((articleId) => {
        if (Object.keys(this.remainsForDateList[date]).includes(articleId)) {
          let remain = {
            articleId: articleId,
            amount: this.remainsForDateList[date][articleId].remains,
            date: date,
            parts: this.remainsForDateList[date][articleId].partIdList,
          };
          remainsList[articleId] = remain;
        }
      });
    }

    return remainsList;
  }

  // Получить стоимость доставки в указанный город.
  // Входные параметры - id города.
  // Возвращаемое значение - число.
  getDeliveryPrice(cityId) {
    return this.deliveryPriceList[cityId];
  }

  // Сконвертировать количество денег из одной валюты в другую.
  // Входные параметры - валюта, из которой конвертируем, валюта, в которую конвертируем, сумма.
  // Возвращаемое значение - число.
  CurrencyConverter(currencyId, newCurrencyId, amount) {
    return (
      (this.ExchangeCurrencyRates[currencyId] * amount) /
      this.ExchangeCurrencyRates[newCurrencyId]
    );
  }
}

let userId = 12345;
// let orderDate = new Date().toISOString().slice(0,10)
let orderDate = "2020-01-01";

let items = [new CartItem(100000001, 30), new CartItem(100000003, 20)];

let cityId = 1001;
let currency = 10002;

let apiClient = new apiClient_class();
let cart = new Cart(userId, orderDate, items, cityId, currency);

// Требуется определить итоговую стоимость заказа.
// Стоимость заказа складывается из
//      стоимости всех позиций и
//      стоимости доставки,
//      причем все цены должны быть взяты в валюте, указанной в заказе.
function getPrice(apiClient, cart) {
  let cartFullSummInCurrency = 0;
  let cartFullSumm = 0;

  for (let i = cart.items.length - 1; i >= 0; i--) {
    const item = cart.items[i];

    // получить стоимость товара
    let articleSum = apiClient.getPriceForArticleForDate(
      cart.orderDate,
      item.articleId
    );
    if (articleSum) {
      // ограничить кол-во товара остатками наскладе
      let itemAmount = Math.min(
        item.quantity,
        apiClient.getRemainsOnDate(orderDate)[item.articleId].amount
      );
      // суммировать общую стоимость в корзине
      cartFullSumm += articleSum.price * itemAmount;
    } else {
      cart.items.splice(i, 1);
    }
  }

  if (cartFullSumm > 0) {
    // плюс доставка
    cartFullSumm += apiClient.getDeliveryPrice(cart.cityId);

    // перевод в валюту заказа
    cartFullSummInCurrency = apiClient.CurrencyConverter(
      apiClient.getDefaultCurrency(),
      cart.currency,
      cartFullSumm
    );
  }
  return cartFullSummInCurrency;
}

console.log(getPrice(apiClient, cart));
