const axios = require("axios");
const cheerio = require("cheerio");

const scrapeAmazonImage = async (productUrl) => {
  try {
    const { data } = await axios.get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const $ = cheerio.load(data);
    const imageUrl = $("#imgTagWrapperId img").attr("src");

    if (!imageUrl) {
      throw new Error("Could not find the product image URL on Amazon.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error scraping Amazon product image:", error);
    return null;
  }
};

const scrapeCromaImage = async (productUrl) => {
  try {
    const { data } = await axios.get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const $ = cheerio.load(data);
    const imageUrl = $("#0prod_img").first().attr("src");

    if (!imageUrl) {
      throw new Error("Could not find the product image URL on Croma.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error scraping Croma product image:", error);
    return null;
  }
};

const scrapeFlipkartImage = async (productUrl) => {
  try {
    const { data } = await axios.get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const $ = cheerio.load(data);
    const imageUrl = $("._396cs4._2amPTt._3qGmMb img").attr("src");

    if (!imageUrl) {
      throw new Error("Could not find the product image URL on Flipkart.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error scraping Flipkart product image:", error);
    return null;
  }
};

const scrapeProductImage = async (productUrl) => {
  if (productUrl.includes("amazon")) {
    return await scrapeAmazonImage(productUrl);
  } else if (productUrl.includes("croma")) {
    return await scrapeCromaImage(productUrl);
  } else if (productUrl.includes("flipkart")) {
    return await scrapeFlipkartImage(productUrl);
  } else {
    throw new Error("Unsupported URL format.");
  }
};

module.exports = scrapeProductImage;
