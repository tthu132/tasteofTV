
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
export const getTimeElapsedString = (commentTime) => {
    const currentTime = Date.now();
    const commentDate = Date.parse(commentTime);
    const timeDiff = currentTime - commentDate;

    // Chuyển đổi thời gian từ milliseconds sang phút
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff < 5) {
        // Nếu thời gian nhỏ hơn 5 phút, trả về "Vừa xong"
        return "Vừa xong";
    } else if (minutesDiff < 60) {
        // Nếu thời gian nhỏ hơn 1 giờ, hiển thị số phút trước
        return `${minutesDiff} phút trước`;
    } else if (minutesDiff < 24 * 60) {
        // Nếu thời gian nhỏ hơn 24 giờ, hiển thị số giờ trước
        const hoursDiff = Math.floor(minutesDiff / 60);
        return `${hoursDiff} giờ trước`;
    } else if (minutesDiff < 24 * 60 * 5) {
        // Nếu thời gian nhỏ hơn 5 ngày, hiển thị số ngày trước
        const daysDiff = Math.floor(minutesDiff / (60 * 24));
        return `${daysDiff} ngày trước`;
    } else {
        // Nếu lớn hơn hoặc bằng 5 ngày, hiển thị ngày tháng năm
        const date = new Date(commentTime);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
};



