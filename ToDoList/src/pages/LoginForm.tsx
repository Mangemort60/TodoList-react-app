import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

export type UserData = {
  id: number;
  username: string;
  password: string;
};

interface LoginFormProps {
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: UserData) => void;
}

const LoginForm = ({setIsAuthenticated, setUser}: LoginFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_UserToken, setUserToken] = useCookies();

  const navigate = useNavigate();
  // Login
  const handleLogin = (data: FormData) => {
    axios
      .post(
        "https://api-rest-todolist-4b99865c33b9.herokuapp.com/api/login",
        data
      )
      .then(response => {
        console.log("connexion à votre compte effectué avec succès");
        setUser(response.data.data);
        const token = response.data.token;
        setIsAuthenticated(true);
        localStorage.setItem("user", response.data.data.id);
        setUserToken("token", token);
        navigate("/dashboard");
      })
      .catch(err => console.log("Erreur lors de la connexion", err));
  };

  // zod object
  const schema = z.object({
    username: z
      .string()
      .min(2, {message: "Le username doit contenir au minimum 2 caractères"})
      .max(15, {
        message: "Le username doit contenir au maximum 15 caractères"
      }),
    password: z
      .string()
      .min(5, {
        message: "Le mot de passe doit contenir au minimum 2 caractères"
      })
      .max(15, {
        message: "Le mot de passe doit contenir au maximum 15 caractères"
      })
  });

  type FormData = z.infer<typeof schema>; // on défini le type de FormData a partir du type du shéma

  // desctructure useForm
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<FormData>({
    resolver: zodResolver(schema)
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
        <form onSubmit={handleSubmit(handleLogin)}>
          <FormControl width="300px" color={"#7cf49a"}>
            <FormLabel>Username</FormLabel>
            <Input id="username" type="text" {...register("username")} variant={"flushed"} />
            {errors.username && (
              <Text
                as={"i"}
                fontSize={"xs"}
                className="text-danger"
                color={"tomato"}>
                {errors.username.message}
              </Text>
            )}
            <FormLabel mt={2}>Password</FormLabel>
            <Input id="password" type="password" {...register("password")} variant={"flushed"}/>
            {errors.password && (
              <Text
                as={"i"}
                fontSize={"xs"}
                className="text-danger"
                color={"tomato"}>
                {errors.password.message}
              </Text>
            )}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Button backgroundColor="#141E30" type="submit" marginTop="3" color={"#7cf49a"} _hover={{backgroundColor:"#243B55"}} >
                Login
              </Button>
              <Button colorScheme="teal" marginTop="3" color={"#7cf49a"}  variant='link'>
                <Link to={"/register"}>register</Link>
              </Button>
            </Box>
          </FormControl>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
