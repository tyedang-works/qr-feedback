"use client";

import { useRouter } from "next/navigation";

import { updateUserAction } from "@/app/dashboard/users-roles/actions";
import UserForm, {
    type UserFormSubmitResult,
} from "@/components/users-roles/UserForm";
import type { UserFormValues } from "@/lib/auth/user-form.schema";

export type EditableUser = {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url: string | null;
};

type EditUserDialogProps = {
    open: boolean;
    user: EditableUser;
    onClose: () => void;
    onUserUpdated: (avatarUrl: string | null) => void;
};

export default function EditUserDialog({
    open,
    user,
    onClose,
    onUserUpdated,
}: EditUserDialogProps) {
    const router = useRouter();

    const initialValues: UserFormValues = {
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        password: "",
        confirmPassword: "",
    };

    const handleSubmit = async (
        values: UserFormValues,
        avatar: File | null,
    ): Promise<UserFormSubmitResult> => {
        const result = await updateUserAction({
            userId: user.id,
            fullName: values.fullName.trim(),
            role: values.role,
            avatar,
        });

        if (result.success) {
            onUserUpdated(result.avatarUrl ?? user.avatar_url);
            router.refresh();
        }

        return result;
    };

    return (
        <UserForm
            open={open}
            mode="edit"
            initialValues={initialValues}
            initialAvatarUrl={user.avatar_url}
            onClose={onClose}
            onSubmit={handleSubmit}
        />
    );
}
