import { useState } from "react";
import "./header.css";
import HeaderLeft from "./HeaderLeft";
import NavBar from "./NavBar";
import HeadRight from "./HeadRight";
const Header = () => {
    const [toggle, setToggle] = useState(false);
    return (
        <header className="header">
            <HeaderLeft toggle={toggle} setToggle={setToggle}/>
            <NavBar toggle={toggle} setToggle={setToggle}/>
            <HeadRight />
        </header>

    );
}

export default Header;