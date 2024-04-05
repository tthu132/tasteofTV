
export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}
export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
export function formatDate(dateString) {
    const dateObject = new Date(dateString);

    // Lấy ngày, tháng và năm
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần +1
    const year = dateObject.getFullYear();

    // Tạo chuỗi ngày tháng năm
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
}
