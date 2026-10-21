"use client";

import { useRouter } from "next/navigation";

import { addUserAction } from "@/app/dashboard/users-roles/actions";
import UserForm from "@/components/users-roles/UserForm";
import type { UserFormValues } from "@/lib/auth/user-form.schema";

type AddUserDialogProps = {
    open: boolean;
    onClose: () => void;
};

const initialValues: UserFormValues = {
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
};

export default function AddUserDialog({ open, onClose }: AddUserDialogProps) {
    const router = useRouter();

    const handleSubmit = async (
        values: UserFormValues,
        avatar: File | null,
    ) => {
        const result = await addUserAction({
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            role: values.role,
            password: values.password,
            avatar,
        });

        if (result.success) {
            router.refresh();
        }

        return result;
    };

    return (
        <UserForm
            open={open}
            mode="add"
            initialValues={initialValues}
            onClose={onClose}
            onSubmit={handleSubmit}
        />
    );
}
