import json
import os
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def start_browser():
    edge_options = Options()
    edge_options.add_argument(r"user-data-dir=C:\Users\ADMIN\AppData\Local\Microsoft\Edge\User Data")
    edge_options.add_argument("profile-directory=Default")
    edge_options.add_argument("--remote-debugging-port=9222")
    edge_options.add_argument("--no-first-run")

    driver = webdriver.Edge(options=edge_options)
    driver.implicitly_wait(10)
    driver.get("https://www.threads.net/")
    print("Trình duyệt đã mở. Vui lòng đăng nhập thủ công và sau đó bấm 'Crawl Data' để tiếp tục.")
    return driver


def extract_content(content):
    parts = content.split("\n")
    filtered_parts = [line.strip() for line in parts[3:] if line.strip() not in ["Translate"] and not line.isdigit()]

    content = " ".join(filtered_parts)

    return content.strip()


def crawl_data(driver):
    try:
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.xrvj5dj.xd0jker.x1evr45z"))
        )
        div_elements = driver.find_elements(By.CSS_SELECTOR, "div.xrvj5dj.xd0jker.x1evr45z")
        return [
            {
                "media": [media.get_attribute("src") for media in div.find_elements(By.CSS_SELECTOR, "img, video")],
                "content": extract_content(div.text.strip()),
            }
            for div in div_elements
        ]
    except Exception as e:
        print(f"Lỗi khi thu thập dữ liệu: {e}")
        return []

def save_data_to_json(data, filename=r"C:\Users\ADMIN\Downloads\data.json"):
    if os.path.exists(filename):
        with open(filename, "r+", encoding="utf-8") as f:
            existing_data = json.load(f)
            existing_data.extend(data)
            f.seek(0)
            json.dump(existing_data, f, ensure_ascii=False, indent=4)
    else:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

def main_menu():
    driver = start_browser()
    while True:
        choice = input("\nMenu:\n1. Crawl Data\n2. Đóng chương trình\nChọn một tùy chọn (1/2): ")
        if choice == '1':
            data = crawl_data(driver)
            save_data_to_json(data)
            print("Dữ liệu đã được lưu vào file JSON.")
        elif choice == '2':
            print("Đóng chương trình...")
            driver.quit()
            break
        else:
            print("Lựa chọn không hợp lệ, vui lòng thử lại.")

main_menu()
