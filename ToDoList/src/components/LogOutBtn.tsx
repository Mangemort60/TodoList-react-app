import {Button} from "@chakra-ui/react";

interface logOutProps {
  onClick: () => void;
}

const LogOutBtn = ({onClick}: logOutProps) => {
  return (
    <Button onClick={onClick} colorScheme="teal" variant="outline">
      Se deconnecter
    </Button>
  );
};

export default LogOutBtn;
