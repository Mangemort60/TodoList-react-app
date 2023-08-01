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
  Text,
  UnorderedList
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
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

export interface ListsProps {
  user: UserData | undefined;
}

type ListsTypes = {
  id: number ;
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
  console.log("les listes", lists);

  const handleCreate = (data: FormData) => {
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
        console.log("la liste a bien été crée ", response.data);
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

  const schema = z.object({
    listTitle: z.string().max(15)
  });

  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6} width={"50%"} margin={"auto"}>
      <GridItem w="100%" h="10" colSpan={1}>
        <Flex direction={"column"} maxWidth={"25rem"}>
          <form onSubmit={handleSubmit(handleCreate)}>
            <FormControl width={"15rem"} color={"#7cf49a"}>
              <FormLabel fontSize='xl'>Listes</FormLabel>
                {errors.listTitle && (
                  <Text
                    as={"i"}
                    fontSize={"xs"}
                    className="text-danger"
                    color={"tomato"}>
                    {errors.listTitle.message}
                  </Text>
                )}
                <Flex width={"100%"} >
                  <Input variant={"flushed"} focusBorderColor="#7cf49a" type="text" id="listTitle" {...register("listTitle")}  placeholder="Titre de la liste"/>
                  <Button type="submit" variant='ghost' ><AddIcon boxSize={3} color={"#7cf49a"}/></Button>
                </Flex>
            </FormControl>
          </form>
          <Box boxShadow='lg' rounded='md' bg='white' marginTop={"1rem"} backgroundColor={"#243B55"} color={"white"}>
            <UnorderedList listStyleType={"none"} m={0}>
              {lists.map(list => (
                <Flex justifyContent={"space-between"} _hover={{backgroundColor: "gray.100", color:"black"}} >
                  <ListItem
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)} cursor={"pointer"} mt={2} width={"80%"} paddingStart={2} >
                    {list.listTitle}
                  </ListItem>
                  <Button onClick={() => HandleDelete(list.id)} variant='ghost'><DeleteIcon color={"gray.400"} cursor={"pointer"}/></Button>
                </Flex>
              ))}
            </UnorderedList>
          </Box>
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
