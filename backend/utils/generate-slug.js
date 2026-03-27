exports.generateSlug = async (title) => {
    let slug = title.toLowerCase().toLowerCase()
    .normalize("NFD") // tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/g, "d") // xử lý riêng chữ đ
    .replace(/[^a-z0-9\s-]/g, "") // xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-") // space -> -
    .replace(/-+/g, "-"); // xóa -- dư;
    return slug;
};