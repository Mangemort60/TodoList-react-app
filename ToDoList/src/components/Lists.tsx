import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useDisclosure
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {UserData} from "../pages/LoginForm";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import Tasks from "./Tasks";
import {TaskType} from "./Tasks";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";

export interface ListsProps {
  user: UserData | undefined;
}

type ListsTypes = {
  id: number;
  listTitle: string;
  UserId: string;
};

const Lists = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [UserToken, _setUserToken] = useCookies();
  const [lists, setLists] = useState<ListsTypes[]>([]);
  const [selectedListId, setSelectedListId] = useState<number>(0);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const userId = localStorage.getItem("user");
  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleCreate = (data: FormData) => {
    console.log("handleCreate");

    const newList = {
      listTitle: data.listTitle || "Nouvelle liste"
    };
    axios
      .post(
        `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/lists/${userId}`,
        newList,
        {
          headers: {
            Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
          }
        }
      )
      .then(response => {
        const createdList = response.data.data;
        setLists(prevLists => [...prevLists, createdList]);
      })
      .catch(error => {
        console.log("une erreur est survenue", error);
      });
    reset();
  };

  useEffect(() => {
    axios
      .get(
        `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/user/lists/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
          }
        }
      )
      .then(response => {
        console.log("listes(s) bien récupéré", response.data.data);
        const getLists = response.data.data;
        setLists(getLists);
      })
      .catch(error => {
        console.log("une erreur est survenue", error);
      });
  }, []);

  const HandleDelete = (id: number) => {
    console.log("handleCreate");

    axios
      .delete(
        `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/lists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
          }
        }
      )
      .then(res => {
        console.log("la liste a bien été supprimé", res.data);
        setLists(prevLists => prevLists.filter(list => list.id !== id));
        setTasks(prevTasks =>
          prevTasks.filter(task => parseInt(task.ListId) !== id)
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUpdate = (id: number, data: FormData2) => {
    console.log(data);

    const updatedListTitle = {
      listTitle: data.editedListTitle
    };
    axios
      .put(
        `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/lists/${id}`,
        updatedListTitle,
        {
          headers: {
            Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
          }
        }
      )
      .then(res => {
        console.log("la liste a bien été edité", res.data.date);
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === id ? {...list, ...res.data.date} : list
          )
        );
      })
      .catch(err => {
        console.log(err);
      });
    reset2();
  };

  const schema = z.object({
    listTitle: z.string().max(15)
  });

  const schema2 = z.object({
    editedListTitle: z.string().max(15)
  });

  type FormData = z.infer<typeof schema>;
  type FormData2 = z.infer<typeof schema2>;

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2
  } = useForm<FormData2>({
    resolver: zodResolver(schema2)
  });

  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      gap={6}
      width={"50%"}
      margin={"auto"}>
      <GridItem w="100%" h="10" colSpan={1}>
        <Flex direction={"column"} maxWidth={"25rem"}>
          <form onSubmit={handleSubmit(handleCreate)}>
            <FormControl width={"15rem"} color={"#7cf49a"}>
              <FormLabel fontSize="xl">Listes</FormLabel>
              {errors.listTitle && (
                <Text
                  as={"i"}
                  fontSize={"xs"}
                  className="text-danger"
                  color={"tomato"}>
                  {errors.listTitle.message}
                </Text>
              )}
              <Flex width={"100%"}>
                <Input
                  variant={"flushed"}
                  focusBorderColor="#7cf49a"
                  type="text"
                  id="listTitle"
                  {...register("listTitle")}
                  placeholder="Titre de la liste"
                />
                <Button type="submit" variant="ghost">
                  <AddIcon boxSize={3} color={"#7cf49a"} />
                </Button>
              </Flex>
            </FormControl>
          </form>
          <Box
            boxShadow="lg"
            rounded="md"
            bg="white"
            marginTop={"1rem"}
            backgroundColor={"#243B55"}
            color={"white"}>
            <UnorderedList listStyleType={"none"} m={0}>
              {lists.map(list => (
                <Flex
                  justifyContent={"space-between"}
                  backgroundColor={
                    selectedListId === list.id ? "#182438" : "#243B55"
                  }
                  _hover={{backgroundColor: "#20334b", color: "white"}}>
                  <ListItem
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    cursor={"pointer"}
                    mt={2}
                    width={"80%"}
                    paddingStart={2}>
                    {list.listTitle}
                  </ListItem>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      onOpen();
                      setSelectedListId(list.id);
                    }}>
                    <EditIcon color={"gray.400"} />
                  </Button>
                  <Button onClick={() => HandleDelete(list.id)} variant="ghost">
                    <DeleteIcon color={"gray.400"} cursor={"pointer"} />
                  </Button>
                </Flex>
              ))}
            </UnorderedList>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <form
              onSubmit={handleSubmit2(data =>
                handleUpdate(selectedListId, data)
              )}>
              <ModalOverlay />
              <ModalContent
                margin={"auto"}
                backgroundColor={"#182438"}
                color={"#7cf49a"}>
                <ModalHeader>Editez votre liste</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Nouveau titre</FormLabel>
                    <Input
                      placeholder="Nouveau titre..."
                      id="editedListTitle"
                      {...register2("editedListTitle")}
                      variant={"flushed"}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    onClick={onClose}
                    colorScheme="blue"
                    mr={3}
                    color={"#7cf49a"}
                    _hover={{backgroundColor: "#243B55"}}
                    backgroundColor="#141E30">
                    Valider
                  </Button>
                  <Button
                    onClick={onClose}
                    colorScheme="teal"
                    color={"#fff"}
                    variant="link">
                    Annuler
                  </Button>
                </ModalFooter>
              </ModalContent>
            </form>
          </Modal>
        </Flex>
      </GridItem>
      <GridItem w="100%" h="100" colSpan={2}>
        <Tasks
          selectedListId={selectedListId}
          tasks={tasks}
          setTasks={setTasks}
        />
      </GridItem>
    </Grid>
  );
};

export default Lists;
