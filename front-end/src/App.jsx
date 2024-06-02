import { useEffect, useRef, useState } from "react";
import JSON_DATA from "./data/combinedProducts.json";
import { Input } from "antd";

const { Search } = Input;
function App() {
  const [itemsToShow, setItemsToShow] = useState(10);
  const [searchKey, setSearchKey] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    if (!searchKey) {
      setFilteredData(JSON_DATA);
    } else if (/^[0-9]+$/.test(searchKey)) {
      setFilteredData(
        JSON_DATA.filter((data) => data.price.includes(searchKey))
      );
    } else if (/[a-zA-Z]/.test(searchKey)) {
      setFilteredData(
        JSON_DATA.filter((data) =>
          data.productName.toLocaleLowerCase().includes(searchKey)
        )
      );
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, JSON_DATA]);

  const onChangeHandler = (event) => {
    setSearchKey(event.target.value);
  };

  return (
    <div className="overflow-hidden h-full">
      <div className="text-[50px] pb-[24px] text-center font-serif">
        PRODUCT PRICE CHECKER
      </div>
      <div className="w-full flex justify-center">
        {
          <Search
            size="large"
            className="w-[50%]"
            onChange={onChangeHandler}
            placeholder="Search for the products"
            loading={loading}
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
        style={{ maxHeight: "74vh" }}
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
  return (
    <div className="p-[16px]">
      <h2 className="w-[300px] pb-[16px]">{props.data.productName}</h2>
      <a href={props.data.url} target="_blank" rel="noopener noreferrer">
        <img
          src="https://via.placeholder.com/300"
          alt={props.data.productName}
        />
      </a>
      <div className="flex justify-between">
        <p>Price: ₹{props.data.price}</p>
        <p>Ratings: {props.data.ratings} ★</p>
      </div>
    </div>
  );
};
