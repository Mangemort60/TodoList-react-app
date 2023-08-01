import Navbar from "../components/NavBar";
import Lists from "../components/Lists";
import {UserData} from "./LoginForm";

interface DashBoardProps {
  onClick: () => void;
  user: UserData | undefined;
}

const DashBoard = ({onClick}: DashBoardProps) => {
  return (
    <>
      <Navbar onClick={onClick} />
      <Lists/>
    </>
  );
};

export default DashBoard;
