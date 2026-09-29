import { getUserContext } from "@/lib/auth/queries";
import { getQRCodeTables } from "@/lib/qr-codes/queries";

import QRCodeList from "@/components/qr-codes/QRCodeList";

export default async function QRCodePage() {
    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    const tables = await getQRCodeTables(
        userContext.restaurantId,
    );

    return (
        <QRCodeList
            data={tables}
        />
    );
}