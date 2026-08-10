from playwright.sync_api import sync_playwright
import os

artifacts_dir = r"C:\Users\user\.gemini\antigravity-ide\brain\d5d544bc-6760-4994-a4a2-7fe2ec13b9ff"

with sync_playwright() as p:
    browser = p.chromium.launch()
    
    # Desktop
    page = browser.new_page(viewport={'width': 1200, 'height': 800})
    page.goto('file:///c:/Users/user/Desktop/o/it-dash/index.html')
    page.wait_for_timeout(1000)
    
    # Select Printer in dropdown
    page.select_option('#hwTypeSelect', 'printer')
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(artifacts_dir, 'printer_filtered.png'))
    
    browser.close()

print("Screenshot taken successfully!")
