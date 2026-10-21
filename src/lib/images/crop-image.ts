import type { Area } from "react-easy-crop";

export async function createCroppedImageFile(
    imageUrl: string,
    originalFile: File,
    croppedAreaPixels: Area,
): Promise<File> {
    const image = new Image();
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Không thể tải ảnh."));
    });

    const { x, y, width, height } = croppedAreaPixels;

    if (width <= 0 || height <= 0) {
        throw new Error("Vùng crop không hợp lệ.");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Không thể khởi tạo canvas.");
    }

    canvas.width = Math.round(width);
    canvas.height = Math.round(height);

    context.drawImage(
        image,
        x,
        y,
        width,
        height,
        0,
        0,
        canvas.width,
        canvas.height,
    );

    const outputType =
        originalFile.type === "image/png"
            ? "image/png"
            : originalFile.type === "image/webp"
              ? "image/webp"
              : "image/jpeg";

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (!result) {
                    reject(new Error("Không thể xử lý ảnh."));
                    return;
                }

                resolve(result);
            },
            outputType,
            outputType === "image/jpeg" ? 0.92 : undefined,
        );
    });

    const extension =
        outputType === "image/png"
            ? "png"
            : outputType === "image/webp"
              ? "webp"
              : "jpg";

    const baseName = originalFile.name.replace(/\.[^.]+$/, "") || "avatar";

    return new File([blob], `${baseName}-cropped.${extension}`, {
        type: outputType,
        lastModified: Date.now(),
    });
}
