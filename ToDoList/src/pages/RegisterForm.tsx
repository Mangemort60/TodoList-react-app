import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";


const RegisterForm = () => {
  const navigate = useNavigate();
  const schema = z.object({
    username: z
      .string()
      .min(2, {message: "Le username doit contenir au minimum 2 caractères"})
      .max(15, {
        message: "Le username doit contenir au maximum 15 caractères",
      }),
    password: z
      .string()
      .min(5, {
        message: "Le mot de passe doit contenir au minimum 2 caractères",
      })
      .max(15, {
        message: "Le mot de passe doit contenir au maximum 15 caractères",
      }),
  });

  const HandleSignIn = (data: FormData) => {
    console.log(data);

    axios
      .post(
        "https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/register",
        data,
      )
      .then(response => {
        console.log(
          "compte crée avec succès",
          response.data,
          response.data.data.id,
        );
        navigate("/login");
      })
      .catch(err => console.log("Erreur lors de la connexion", err));
  };

  type FormData = z.infer<typeof schema>; // on récupère le schema pour faire le type

  // desctructure useForm
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  return (
    <>
      <Box
        width="100%"
        height="100vh"
        display="flex"
        justifyContent="space-evenly"
        alignItems="center">
          
          <Box>
            <Text fontSize={"8xl"} fontWeight={"bold"} color={"white"}>It is time<br/><Box color="#7cf49a">ToDo.</Box></Text>
          </Box>
        <form onSubmit={handleSubmit(HandleSignIn)}>
          <FormControl width="300px" color={"#7cf49a"}>
            <FormLabel>Username</FormLabel>
            <Input type="text" {...register("username")} variant={"flushed"}/>
            {errors.username && (
              <Text className="text-danger" color={"tomato"}>
                {errors.username.message}
              </Text>
            )}
            <FormLabel mt={2}>Password</FormLabel>
            <Input type="password" {...register("password")} variant={"flushed"}/>
            {errors.password && (
              <Text className="text-danger" color={"tomato"}>
                {errors.password.message}
              </Text>
            )}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Button backgroundColor="#141E30" type="submit" marginTop="3" color={"#7cf49a"} _hover={{backgroundColor:"#243B55"}} onClick={() => HandleSignIn} >
                S'inscrire
              </Button>
              <Text color={"white"} fontSize={"md"}>Already registered ? <Button colorScheme="teal" marginTop="3" color={"#7cf49a"}  variant='link'><Link to={"/login"}>login</Link></Button></Text>
            </Box>
          </FormControl>
        </form>
      </Box>
    </>
  );
};

export default RegisterForm;
