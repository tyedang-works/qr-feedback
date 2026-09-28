import * as yup from "yup";

export const createTableSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên bàn."),
});