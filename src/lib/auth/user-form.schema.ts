import * as yup from "yup";

export type UserFormMode = "add" | "edit";

export type UserFormValues = {
    fullName: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
};

export const createUserFormSchema = (mode: UserFormMode) =>
    yup.object({
        fullName: yup
            .string()
            .trim()
            .required(" ")
            .max(100, "Tên không được vượt quá 100 ký tự."),

        email:
            mode === "add"
                ? yup.string().trim().email("Email không hợp lệ.").required(" ")
                : yup.string().defined(),

        role: yup.string().required(" "),

        password:
            mode === "add"
                ? yup
                      .string()
                      .required(" ")
                      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
                      .max(72, "Mật khẩu không được vượt quá 72 ký tự.")
                : yup.string().notRequired(),

        confirmPassword:
            mode === "add"
                ? yup
                      .string()
                      .required(" ")
                      .oneOf(
                          [yup.ref("password")],
                          "Mật khẩu xác nhận không khớp.",
                      )
                : yup.string().notRequired(),
    });
