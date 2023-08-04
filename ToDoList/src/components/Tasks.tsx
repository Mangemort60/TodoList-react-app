import {
  FormControl,
  FormLabel,
  Flex,
  Input,
  Button,
  Text,
  UnorderedList,
  ListItem,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {useCookies} from "react-cookie";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";

export type TaskType = {
  id: number;
  taskTitle: string;
  ListId: string;
};

interface TasksProps {
  selectedListId: number;
  tasks: TaskType[];
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
}

const Tasks = ({selectedListId, tasks, setTasks}: TasksProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [UserToken, _setUserToken] = useCookies();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);
  console.log(selectedTaskId);
  console.log(tasks);

  const handleCreate = (data: FormData) => {
    const newTask = {
      taskTitle: data.taskTitle
    };
    axios
      .post(
        `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/tasks/${selectedListId}`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
          }
        }
      )
      .then(response => {
        console.log("la tâche a bien été ajoutée", response.data);
        const createdTask = response.data.data;
        setTasks(prevTasks => [...prevTasks, createdTask]);
      })
      .catch(error => {
        console.log("une erreur est survenue", error);
      });
    reset();
  };

  useEffect(() => {
    if (selectedListId) {
      axios
        .get(
          `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/lists/tasks/${selectedListId}`,
          {
            headers: {
              Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
            }
          }
        )
        .then(response => {
          console.log("tache(s) bien récupéré", response.data.data);
          const getTasks = response.data.data;
          setTasks(getTasks);
        })
        .catch(error => {
          console.log("une erreur est survenue", error);
        });
    }
  }, [selectedListId]);

  const HandleDelete = (id: number) => {
    axios
      .delete(
        `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
          }
        }
      )
      .then(res => {
        console.log("la liste a bien été supprimé", res.data);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUpdate = (id: number, data: FormData3) => {
    const editedTask = {
      taskTitle: data.editedTaskTitle
    };

    axios
      .put(
        `https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/tasks/${id}`,
        editedTask,
        {
          headers: {
            Authorization: `Bearer ${UserToken.token}` // Ajoutez le token dans l'en-tête
          }
        }
      )
      .then(res => {
        console.log("la liste a bien été édité", res.data.date);
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === id ? {...task, ...res.data.date} : task
          )
        );
      })
      .catch(err => {
        console.log(err);
      });
    reset2();
  };

  const schema = z.object({
    taskTitle: z.string().min(2).max(15)
  });

  type FormData = z.infer<typeof schema>;

  const schema3 = z.object({
    editedTaskTitle: z.string().min(2).max(15)
  });

  type FormData3 = z.infer<typeof schema3>;

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset2
  } = useForm<FormData3>({
    resolver: zodResolver(schema3)
  });

  return (
    <>
      <Flex direction={"column"} maxWidth={"50rem"}>
        <form onSubmit={handleSubmit(handleCreate)}>
          <FormControl width={"15rem"} color={"#7cf49a"}>
            <FormLabel color={"#7cf49a"} fontSize="xl">
              Tâches
            </FormLabel>
            {errors.taskTitle && (
              <Text
                as={"i"}
                fontSize={"xs"}
                className="text-danger"
                color={"tomato"}>
                {errors.taskTitle.message}
              </Text>
            )}
            <Flex>
              <Input
                type="text"
                id="taskTitle"
                {...register("taskTitle")}
                variant={"flushed"}
                focusBorderColor="#7cf49a"
                placeholder="Titre de la tâche"
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
          backgroundColor={"#243B55"}
          color={"white"}
          marginTop={"1rem"}>
          <UnorderedList listStyleType={"none"} m={0}>
            {selectedListId ? (
              tasks.length === 0 ? (
                <Text p={2}>Liste vide</Text>
              ) : (
                // Mappez les tâches
                tasks.map(task => (
                  <Flex
                    _hover={{backgroundColor: "#20334b", color: "white"}}
                    justifyContent={"space-between"}
                    key={task.id}>
                    <ListItem
                      key={task.id}
                      mt={2}
                      paddingStart={2}
                      cursor={"pointer"}>
                      {task.taskTitle}
                    </ListItem>
                    <Box>
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          onOpen();
                          setSelectedTaskId(task.id);
                        }}>
                        <EditIcon color={"gray.400"} />
                      </Button>
                      <Button
                        onClick={() => HandleDelete(task.id)}
                        variant="ghost">
                        <DeleteIcon color={"gray.400"} />
                      </Button>
                    </Box>
                  </Flex>
                ))
              )
            ) : (
              <Text p={2}>Veuillez selectionner une tache</Text>
            )}{" "}
          </UnorderedList>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <form
            onSubmit={handleSubmit3(data =>
              handleUpdate(selectedTaskId, data)
            )}>
            <ModalOverlay />
            <ModalContent
              margin={"auto"}
              backgroundColor={"#182438"}
              color={"#7cf49a"}>
              <ModalHeader>Editez votre tâche</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Nouveau titre</FormLabel>
                  <Input
                    placeholder="Nouveau titre..."
                    id="editedTaskTitle"
                    {...register3("editedTaskTitle")}
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
    </>
  );
};

export default Tasks;
