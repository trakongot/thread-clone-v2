import random
import json
import datetime
from bson import ObjectId

user_ids = [
    '673b5a25e2e8d0b34c4029a7',
    '673b5abde2e8d0b34c4029d0',
    '673b5c5f27c539265bb40fbf',
    '673b5d3f27c539265bb40fde',
    '673b5e3d303855f3dc26deb7',
    '673b5f26303855f3dc26dec8',
    '673b6001303855f3dc26deeb',
    '673b617c28de80888aeb8bc4',
    '673b623528de80888aeb8be7',
    '673b633a28de80888aeb8c0e',
    '673b63ba28de80888aeb8c29',
    '673b647728de80888aeb8c4b',
    '673b64f028de80888aeb8c5e',
    '673b656628de80888aeb8c77',
    '673b675623db126af69a3991',
    '673b67b223db126af69a39a0',
    '673b680b23db126af69a39b3',
    '673b68e923db126af69a39cf',
    '673b696123db126af69a39e4',
    '673b69d823db126af69a39fd'
]

with open('C:/Users/ADMIN/Downloads/data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def random_datetime_within_last_week():
    now = datetime.datetime.now(datetime.timezone.utc)  # Sửa lỗi với `datetime.utcnow()` đã bị deprecated
    delta_days = random.randint(0, 7)
    random_time = now - datetime.timedelta(days=delta_days)
    return random_time.isoformat()

def generate_thread(data, user_ids):
    threads = []
    for item in data:
        posted_by = random.choice(user_ids)
        imgs = item["media"]
        thread = {
            "postedBy": {
                "$oid": str(ObjectId(posted_by))
            },
            "text": item["content"],
            "imgs": imgs,
            "likes": [str(ObjectId(random.choice(user_ids))) for _ in range(random.randint(0, 10))],
            "likeCount": random.randint(0, 100),
            "commentCount": random.randint(0, 20),
            "shareCount": random.randint(0, 10),
            "repostCount": random.randint(0, 10),
            "parentId": None,
            "children": [],
            "isHidden": random.choice([True, False]),
            "createdAt": random_datetime_within_last_week(),
            "__v": 0
        }
        threads.append(thread)
    return threads

threads = generate_thread(data, user_ids)

with open("C:/Users/ADMIN/Downloads/thread.json", 'w', encoding='utf-8') as f:
    json.dump(threads, f, indent=2)

print(f"Generated {len(threads)} threads and saved to 'thread-UTC-data.json'.")
