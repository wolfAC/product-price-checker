import { useEffect, useRef, useState } from "react";
import JSON_DATA from "./data/combinedProducts.json";
import { Input } from "antd";

const { Search } = Input;
function App() {
  const [itemsToShow, setItemsToShow] = useState(10);
  const [searchKey, setSearchKey] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const containerRef = useRef(null);

  const loadMoreItems = () => {
    setItemsToShow((prev) => prev + 10);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        loadMoreItems();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!searchKey) {
      setFilteredData(JSON_DATA);
    }
  }, [searchKey]);

  const onChangeHandler = (event) => {
    setSearchKey(event.target.value);
  };

  return (
    <div className="overflow-hidden h-full">
      <div className="text-[50px] pb-[24px] text-center edu-vic-wa-nt-beginner-regular">
        C & R<h1>COMPARE AND RECOMMENDATIONS</h1>
      </div>
      <div className="w-full flex justify-center">
        {
          <Search
            size="large"
            className="w-[50%]"
            onChange={onChangeHandler}
            onPressEnter={() => {
              if (!searchKey) {
                setFilteredData(JSON_DATA);
              } else if (/^[0-9]+$/.test(searchKey)) {
                setFilteredData(
                  JSON_DATA.filter((data) =>
                    data.price.includes(searchKey.toLocaleLowerCase())
                  )
                );
              } else if (/[a-zA-Z]/.test(searchKey)) {
                setFilteredData(
                  JSON_DATA.filter((data) =>
                    data.productName
                      .toLocaleLowerCase()
                      .includes(searchKey.toLocaleLowerCase())
                  )
                );
              }
            }}
            placeholder="Search for the products"
          />
        }
      </div>
      <div className="flex justify-between py-[16px] px-[40px]">
        <div className="text-left">
          {searchKey ? `Showing results for : ${searchKey}` : ""}
        </div>
        <div className="text-left">
          Total no of products : {filteredData?.length}
        </div>
      </div>
      <div
        className="flex flex-wrap w-full justify-between overflow-y-auto px-[24px] custom-scroll"
        style={{ maxHeight: "65vh" }}
        ref={containerRef}
      >
        {filteredData?.slice(0, itemsToShow)?.map((data, index) => (
          <div key={index}>
            <ProductCard data={data} />
          </div>
        ))}

        {filteredData?.length !== 0 && itemsToShow > filteredData?.length && (
          <div className="flex justify-center w-full items-center">
            * * * * * * * * * YOU HAVE REACHED THE BOTTOM * * * * * * * * *
          </div>
        )}
      </div>
      {filteredData?.length === 0 && searchKey && (
        <div className="flex justify-center w-full items-center">
          * * * * * * * * * THE PRODUCT IS NOT AVAILABLE* * * * * * * * *
        </div>
      )}
    </div>
  );
}

export default App;

const ProductCard = (props) => {
  const data = {
    apple:
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=VW44dkRidm5wazhwcGxtL0cyaEJ2VTkrNXBUdUJSK1k4NE5seUtJaW80Y1JhMkZic05CWW9VU1dxSWZUUWVyT3B3azBNWWRMTTJUR1Y1SkFQMTJmYytRU0p3cnVrZzhmdWQwTDVYRlMxUFpLVUtTU1p5Q3hjSjJnWUpQQWJXd2pMZklqcUZDbWdZWTl4MzFJMU9ocFJBPT0=&traceId=1",
    samsung:
      "https://www.myg.in/images/thumbnails/624/460/detailed/51/S24ULTRAGREY1.JPEG",
    vivo: "https://www.cellspare.com/image/cache/catalog/data/Accessories%20Villa/Product%20image/vivo-x80-rear-housing-panel-module-urben-blue-1000x1000.jpg",
    oppo: "https://m-cdn.phonearena.com/images/phones/62918-940/OPPO-F1s.jpg?w=1",
  };

  return (
    <div className="p-[16px]">
      <h2 className="w-[300px] pb-[16px]">{props.data.productName}</h2>
      <a href={props.data.url} target="_blank" rel="noopener noreferrer">
        <img
          className="w-[300px] h-[300px]"
          style={{ objectFit: "cover" }}
          src={data[detectBrand(props.data.productName)]}
          alt={props.data.productName}
        />
      </a>
      <div className="flex justify-between">
        <p className="capitalize">{detectShop(props.data.url)}</p>
        <p>Price: ₹{props.data.price}</p>
        <p>Ratings: {props.data.ratings} ★</p>
      </div>
    </div>
  );
};

const detectBrand = (productName) => {
  const brands = [
    "Apple",
    "Samsung",
    "Huawei",
    "Xiaomi",
    "OnePlus",
    "Google",
    "Sony",
    "LG",
    "Oppo",
    "Vivo",
    "Nokia",
    "Motorola",
  ];

  for (const brand of brands) {
    if (productName.toLowerCase().includes(brand.toLowerCase())) {
      return brand.toLocaleLowerCase();
    }
  }

  return "Unknown Brand";
};

const detectShop = (url) => {
  const shops = ["Amazon", "Flipkart", "Chroma"];

  for (const shop of shops) {
    if (url.toLowerCase().includes(shop.toLowerCase())) {
      return shop.toLocaleLowerCase();
    }
  }

  return "Unknown Shop";
};
