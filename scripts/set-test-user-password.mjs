import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    },
);

const users = [
    {
        email: "dangbatai.it@gmail.com",
        password: "Abc@123",
    },
    {
        email: "tyemail@mailinator.com",
        password: "Abc@123",
    },
];

async function main() {
    for (const user of users) {
        const { data, error } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
        });

        if (error) {
            throw error;
        }

        const targetUser = data.users.find(
            (item) => item.email?.toLowerCase() === user.email.toLowerCase(),
        );

        if (!targetUser) {
            console.error(`❌ Không tìm thấy user: ${user.email}`);
            continue;
        }

        const { error: updateError } = await supabase.auth.admin.updateUserById(
            targetUser.id,
            {
                password: user.password,
                email_confirm: true,
            },
        );

        if (updateError) {
            console.error(
                `❌ Không thể đặt password cho ${user.email}:`,
                updateError.message,
            );
            continue;
        }

        console.log(`✅ Đã đặt password cho ${user.email}`);
    }
}

main().catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
});
