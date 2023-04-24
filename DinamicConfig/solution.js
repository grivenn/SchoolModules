

module.exports = function (configValue) {

  const dynamicConfigValue = (val) => {
    return () => configValue(val);
  };

  const makeDynamicConfig = (e) => {
    const recurse = (obj) => {
      let newObj;

      if (typeof obj == "object") {
        if (Array.isArray(obj)) {
          newObj = [];
        } else {
          newObj = {};
        }
      }

      Object.keys(obj).forEach((key) => {
        
        // null
        if (obj[key] == null) {
          newObj[key] = null;
          return;
        }

        // массив или объект
        if (typeof obj[key] == "object") {
          if (Array.isArray(obj[key])) {
            newObj[key] = [...recurse(obj[key])];
          } else {
            newObj[key] = recurse(obj[key]);
          }
        } 
        
        // функция        
        else if (typeof obj[key] == "function") {
          try {
            newObj[key] = obj[key]();
          } catch (error) {}
        } 
        
        // примитивы
        else {
          newObj[key] = obj[key];
        }
      });

      return newObj;
    };


    return () => recurse(e)
  };

  return {
    makeDynamicConfig,
    dynamicConfigValue,
  };
};
