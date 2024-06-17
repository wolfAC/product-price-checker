import { useEffect, useRef, useState } from "react";
import JSON_DATA from "./data/combinedProducts.json";
import { Input } from "antd";
import Header from "./component/Header/Header";

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
      <Header
        title="COMPARE AND RECOMMENDATIONS"
        searchBar={
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
                    data.productname
                      .toLocaleLowerCase()
                      .includes(searchKey.toLocaleLowerCase())
                  )
                );
              }
            }}
            placeholder="Search for the products"
          />
        }
      />
      {/* <div className="w-full flex justify-center">
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
                    data.productname
                      .toLocaleLowerCase()
                      .includes(searchKey.toLocaleLowerCase())
                  )
                );
              }
            }}
            placeholder="Search for the products"
          />
        }
      </div> */}
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
        style={{ maxHeight: "78vh" }}
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
    charger: "https://images.app.goo.gl/1f12DGCicsJxTt4A7",
    boat: "https://m.media-amazon.com/images/I/61P2W6vblIL._SX679_.jpg",
    dell: "https://images.app.goo.gl/cEsk7ze7ozG2sX5n6",
    computer: "https://images.app.goo.gl/PJ5EJ7LsSHuVPBVz8",
    redmi: "https://images.app.goo.gl/fqDABfQMoPpRcZhc7",
    hp: "https://images.app.goo.gl/8iMfopU5bxt8LHfs7",
  };

  console.log(detectBrand(props.data.productname), props.data.productname);

  return (
    <div className="p-[16px]">
      <h2 className="w-[300px] pb-[16px]">{props.data.productname}</h2>
      <a href={props.data.url} target="_blank" rel="noopener noreferrer">
        <img
          className="w-[300px] h-[300px]"
          style={{ objectFit: "cover" }}
          // src={data[detectBrand(props.data.productname)]}
          src={props.data.imageurl || data[detectBrand(props.data.productname)]}
          alt={props.data.productname}
        />
      </a>
      <div className="flex justify-between">
        {/* {console.log(fetchProductImage(props.data.url))} */}
        <p className="capitalize">{detectShop(props.data.url)}</p>
        <p>Price: ₹{props.data.price}</p>
        <p>Ratings: {props.data.ratings} ★</p>
      </div>
    </div>
  );
};

const detectBrand = (productname) => {
  const brands = [
    "Apple",
    "Samsung",
    "Huawei",
    "Computer",
    "Redmi",
    "MI",
    "realme",
    "LEAF",
    "pTron",
    "Dell",
    "HP",
    "ASUS",
    "Boat",
    "Lenovo",
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
    if (productname?.toLowerCase()?.includes(brand.toLowerCase())) {
      return brand.toLocaleLowerCase();
    }
  }

  return "Unknown Brand";
};

const detectShop = (url) => {
  const shops = ["Amazon", "Flipkart", "Croma"];

  for (const shop of shops) {
    if (url.toLowerCase().includes(shop.toLowerCase())) {
      return shop.toLocaleLowerCase();
    }
  }

  return "Unknown Shop";
};

const fetchProductImage = async (productUrl) => {
  try {
    const response = await fetch(productUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    // Adjust the path according to your API's response structure
    const imageurl = data.imageurl;
    return imageurl;
  } catch (error) {
    console.error("Error fetching product image:", error);
    return null;
  }
};
