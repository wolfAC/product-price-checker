const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const scrapeProductImage = require("./scrapeProductImage");

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const determineCategory = (productName) => {
  productName = productName?.toLowerCase();
  if (productName?.includes("phone")) return "Phone";
  if (productName?.includes("tws") || productName?.includes("earbud"))
    return "TWS";
  if (productName?.includes("computer") || productName?.includes("laptop"))
    return "Computer";
  return "Other";
};

let combinedData = [];

fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  for (const file of files.filter((file) => file.endsWith(".xlsx"))) {
    const filePath = path.join(directoryPath, file);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let jsonData = xlsx.utils.sheet_to_json(worksheet);

    jsonData = await Promise.all(
      jsonData.map(async (data) => {
        const cleanedData = cleanPriceField(data);
        // Assuming you have a field `productUrl` in your data
        if (cleanedData.url && !cleanedData.imageurl) {
          const imageUrl = await scrapeProductImage(cleanedData.url);
          cleanedData.imageUrl = imageUrl;
          await delay(10000);
        }
        cleanedData.category = determineCategory(cleanedData.productName);
        const camelCaseData = keysToCamelCase(cleanedData);
        console.log(camelCaseData);
        return camelCaseData;
      })
    );

    combinedData = combinedData.concat(jsonData);
    fs.unlinkSync(filePath);
  }

  const newWorksheet = xlsx.utils.json_to_sheet(combinedData);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, "CombinedData");
  xlsx.writeFile(
    newWorkbook,
    path.join(directoryPath, "combinedProducts.xlsx")
  );

  fs.writeFile(
    "../front-end/src/data/combinedProducts.json",
    JSON.stringify(combinedData, null, 2),
    (err) => {
      if (err) throw err;
      console.log("Combined JSON file has been saved.");
    }
  );
});
