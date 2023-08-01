import {Box, Button, Icon, Spacer, Text} from "@chakra-ui/react";
import { FiLogOut } from 'react-icons/fi'

export interface NavBarProps {
  onClick: () => void;
}

const NavBar = ({onClick}: NavBarProps) => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        p={5}
        alignItems={"center"}
        color={"#7cf49a"}>
        <Text fontSize='xl' >TODO</Text>
        <Button onClick={onClick} color={"#7cf49a"} variant={"none"} _hover={{border:"1px", borderColor: "#7cf49a"}} size='lg' >
         Logout<Icon as={FiLogOut} boxSize={6} ml={2}/>
        </Button>
      </Box>
      <Spacer h={"200px"}/>
    </>
  );
};

export default NavBar;
