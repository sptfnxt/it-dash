from playwright.sync_api import sync_playwright
import os

artifacts_dir = r"C:\Users\Bank\.gemini\antigravity-ide\brain\1e29e11d-5643-4075-9718-88d5e8de65ef"

with sync_playwright() as p:
    browser = p.chromium.launch()
    
    # Desktop
    page = browser.new_page(viewport={'width': 1200, 'height': 800})
    page.goto('file:///E:/it-dash/index.html')
    page.wait_for_timeout(2000) # Wait for charts to load
    page.screenshot(path=os.path.join(artifacts_dir, 'desktop_view.png'), full_page=True)
    
    # Mobile
    page2 = browser.new_page(viewport={'width': 375, 'height': 812})
    page2.goto('file:///E:/it-dash/index.html')
    page2.wait_for_timeout(2000)
    page2.screenshot(path=os.path.join(artifacts_dir, 'mobile_view.png'), full_page=True)
    
    browser.close()

print("Screenshots taken successfully!")
