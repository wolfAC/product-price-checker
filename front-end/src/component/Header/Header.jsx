import "./Header.css";
import logo from "../../assets/costa-rica.png";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

const Header = (props) => {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="E-Commerce Logo" />
        </a>
        <h1 className="title">{props.title}</h1>
      </div>
      {props.searchBar}
      <div className="flex w-fit">
        <UserOutlined
          style={{ fontSize: "1.5em", width: "24px", height: "4em" }}
        />
        <ShoppingCartOutlined
          style={{ fontSize: "1.5em", width: "24px", height: "4em" }}
        />
      </div>
    </header>
  );
};

export default Header;
