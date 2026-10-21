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
            .required("Vui lòng nhập tên.")
            .max(100, "Tên không được vượt quá 100 ký tự."),

        email:
            mode === "add"
                ? yup
                      .string()
                      .trim()
                      .email("Email không hợp lệ.")
                      .required("Vui lòng nhập email.")
                : yup.string().defined(),

        role: yup.string().required("Vui lòng chọn role."),

        password:
            mode === "add"
                ? yup
                      .string()
                      .required("Vui lòng nhập mật khẩu.")
                      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
                      .max(72, "Mật khẩu không được vượt quá 72 ký tự.")
                : yup.string().notRequired(),

        confirmPassword:
            mode === "add"
                ? yup
                      .string()
                      .required("Vui lòng xác nhận mật khẩu.")
                      .oneOf(
                          [yup.ref("password")],
                          "Mật khẩu xác nhận không khớp.",
                      )
                : yup.string().notRequired(),
    });
