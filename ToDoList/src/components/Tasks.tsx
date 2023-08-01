import {
  FormControl,
  FormLabel,
  Flex,
  Input,
  Button,
  Text,
  UnorderedList,
  ListItem,
  Box
} from "@chakra-ui/react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {useCookies} from "react-cookie";
import {Dispatch, SetStateAction, useEffect} from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

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
  console.log("les taches : ", tasks);
  console.log("l'ID de la liste selectionné : ", selectedListId);
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

  const schema = z.object({
    taskTitle: z.string().min(2).max(15)
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
    <>
      <Flex direction={"column"}  maxWidth={"50rem"} >
        <form onSubmit={handleSubmit(handleCreate)}>
          <FormControl width={"15rem"} color={"#7cf49a"}>
            <FormLabel color={"#7cf49a"} fontSize='xl'>Tâches</FormLabel>
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
                <Input type="text" id="taskTitle" {...register("taskTitle")} variant={"flushed"} focusBorderColor="#7cf49a" placeholder="Titre de la tâche"/>
                <Button type="submit" variant='ghost'><AddIcon boxSize={3} color={"#7cf49a"}/></Button>
              </Flex>
          </FormControl>
        </form>
        <Box boxShadow='lg' rounded='md' backgroundColor={"#243B55"} color={"white"} marginTop={"1rem"}>
          <UnorderedList listStyleType={"none"}>
            {selectedListId ? (
              tasks.length === 0 ? (
                <Text p={2}>Liste vide</Text>
              ) : (
                // Mappez les tâches
                tasks.map(task => (
                  <Flex justifyContent={"space-between"} key={task.id}>
                    <ListItem mt={2}>{task.taskTitle}</ListItem>
                    <Button onClick={() => HandleDelete(task.id)} variant='ghost' ><DeleteIcon color={"gray.400"}/></Button>
                  </Flex>
                ))
              )
            ) : (
              <Text p={2}>Veuillez selectionner une tache</Text>
            )}{" "}
          </UnorderedList>
        </Box>
      </Flex>
    </>
  );
};

export default Tasks;
