const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const directoryPath = "./excels";

const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
};

const keysToCamelCase = (obj) => {
  const newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[toCamelCase(key)] = obj[key];
    }
  }
  return newObj;
};

const cleanPriceField = (data) => {
  if (data.price) {
    data.price = data.price.toString().replace(/₹|,/g, "").trim();
  }
  for (let key in data) {
    if (data.hasOwnProperty(key) && key !== "price") {
      data[key] = data[key].toString();
    }
  }
  return data;
};

let combinedData = [];

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files
    .filter((file) => file.endsWith(".xlsx"))
    .forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let jsonData = xlsx.utils.sheet_to_json(worksheet);

      jsonData = jsonData.map((data) => {
        const camelCaseData = keysToCamelCase(data);
        return cleanPriceField(camelCaseData);
      });

      combinedData = combinedData.concat(jsonData);
    });

  fs.writeFile(
    "../front-end/src/data/combinedProducts.json",
    JSON.stringify(combinedData, null, 2),
    (err) => {
      if (err) throw err;
      console.log("Combined JSON file has been saved.");
    }
  );
});
