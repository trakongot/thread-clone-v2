import json

def load_users_from_json(file_path):
    # Mở và đọc tệp JSON với mã hóa UTF-8
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def add_random_followers(users, accounts):
    import random
    # Chọn một số tài khoản ngẫu nhiên để làm follower
    for user in users:
        # Lấy một số lượng ngẫu nhiên các tài khoản để thêm vào followers
        followers_count = random.randint(1, 5)  # Chọn từ 1 đến 5 followers ngẫu nhiên
        random_followers = random.sample(accounts, followers_count)
        user['followers'] = [{"$oid": follower['$oid']} for follower in random_followers]
    return users

def save_users_to_json(file_path, data):
    # Ghi dữ liệu vào tệp JSON mới
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

# Đọc tệp JSON chứa người dùng
  # Nhập đường dẫn tệp JSON đầu vào
users_data = load_users_from_json("C:/Users/ADMIN/Downloads/UTC-forum.users (1).json")

# Danh sách các tài khoản
accounts = [
    {"$oid": "673b5a25e2e8d0b34c4029a7"},
    {"$oid": "673b5abde2e8d0b34c4029d0"},
    {"$oid": "673b5c5f27c539265bb40fbf"},
    {"$oid": "673b5d3f27c539265bb40fde"},
    {"$oid": "673b5e3d303855f3dc26deb7"},
    {"$oid": "673b5f26303855f3dc26dec8"},
    {"$oid": "673b6001303855f3dc26deeb"},
    {"$oid": "673b617c28de80888aeb8bc4"},
    {"$oid": "673b623528de80888aeb8be7"},
    {"$oid": "673b633a28de80888aeb8c0e"}
]

# Thêm followers ngẫu nhiên cho mỗi người dùng
updated_users_data = add_random_followers(users_data, accounts)

# Lưu dữ liệu đã cập nhật vào tệp JSON mới
output_file_path = "C:/Users/ADMIN/Downloads/user.json" # Nhập đường dẫn tệp JSON đầu ra
save_users_to_json(output_file_path, updated_users_data)

print(f"Dữ liệu đã được lưu vào tệp JSON: {output_file_path}")
