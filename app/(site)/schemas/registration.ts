import * as Yup from "yup";

export const registrationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(40, "Name must consists of 40 characters"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must have at least 8 characters")
    .max(32, "Password must consist of 32 characters")
    .required("Password is required"),
});
