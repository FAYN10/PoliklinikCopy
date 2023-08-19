import { useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Image from "next/image";
import {login} from "api/login";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";
import st from "styles/module/pages/Login.module.scss";
import DialogOTP from "components/DialogOTP";

const Login = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isLoginError, setIsLoginError] = useState({
    state: false,
    message: "",
  });
  const loginSchema = Yup.object({
    username: Yup.string("Enter your username").required(
      "Username is required"
    ),
    password: Yup.string("Enter your password").required(
      "Password is required"
    ),
  });
  const loginValidation = useFormik({
    initialValues: {
      username: "",
      password: "",
      isPasswordVisible: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      let data = {
        username: values.username,
        password: values.password,
        token: "",
        otp: ""
      };
      try {
        setIsLoginLoading(true);
        const response = await login(data);
        data.token = response.data.data.token;
        setDataOTP(data);
        setDialogOTP(true);
      } catch (error) {
        setIsLoginError({ state: true, message: error.message });
      } finally {
        setIsLoginLoading(false);
      }
    },
  });
  // temp
  const [dialogOTP, setDialogOTP] = useState(false);
  const [dataOTP, setDataOTP] = useState({});

  return (
    <>
      <div className={st.container}>
        <form onSubmit={loginValidation.handleSubmit}>
          <div className={st.cardWrapper}>
            <div className={st.header}>
              <Image
                src="/icons/logo.png"
                width={80}
                height={80}
                alt="logo-rsmp"
              />
              <p className="ml-10 font-24 font-w-700 text-green-primary">
                RSU Mitra Paramedika
              </p>
            </div>
            <div className={st.body}>
              <div className={st.illusSection}>
                <Image
                  src="/icons/health1.svg"
                  width={321}
                  height={265}
                  alt="doctor-illustration"
                />
              </div>
              <div className={st.formSection}>
                <p className="font-24 text-green-primary font-w-600">Login</p>
                <div className="mb-12">
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    variant="standard"
                    autoComplete="off"
                    value={loginValidation.values.username}
                    onChange={loginValidation.handleChange}
                    error={
                      loginValidation.touched.username &&
                      Boolean(loginValidation.errors.username)
                    }
                    helperText={
                      loginValidation.touched.username &&
                      loginValidation.errors.username
                    }
                  />
                </div>
                <div>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel
                      htmlFor="standard-adornment-password"
                      error={
                        loginValidation.touched.password &&
                        Boolean(loginValidation.errors.password)
                      }
                    >
                      Password
                    </InputLabel>
                    <Input
                      id="password"
                      name="password"
                      autoComplete="off"
                      type={
                        loginValidation.values.isPasswordVisible
                          ? "text"
                          : "password"
                      }
                      value={loginValidation.values.password}
                      onChange={loginValidation.handleChange}
                      error={
                        loginValidation.touched.password &&
                        Boolean(loginValidation.errors.password)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              loginValidation.setFieldValue(
                                "isPasswordVisible",
                                !loginValidation.values.isPasswordVisible
                              )
                            }
                          >
                            {loginValidation.values.isPasswordVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {loginValidation.touched.password &&
                      loginValidation.errors.password && (
                        <FormHelperText id="component-error-text" error>
                          {loginValidation.errors.password}
                        </FormHelperText>
                      )}
                  </FormControl>
                </div>
                <a
                  className={`${st.forgotPassBtn} mt-8 mb-28 text-green-primary pointer`}
                  onClick={() => setDialogOTP(true)}
                >
                  Lupa password?
                </a>
                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className={`${st.loginBtn} mt-auto pointer`}
                >
                  {!isLoginLoading ? (
                    "LOGIN"
                  ) : (
                    <Spinner size={15} color={"white"} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* temp */}
      <DialogOTP state={dialogOTP} setState={setDialogOTP} data={dataOTP} />
      <Snackbar
        message={isLoginError.message}
        state={isLoginError.state}
        setState={(payload) =>
          setIsLoginError((prev) => ({ ...prev, state: payload }))
        }
        isErrorType
      />
    </>
  );
};

export default Login;
