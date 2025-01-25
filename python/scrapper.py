import requests
from bs4 import BeautifulSoup
import json
import time
import re
from fuzzywuzzy import process

# List of documentation URLs for mParticle, Lytics, and Zeotap
urls = [
    "https://docs.mparticle.com/",
    "https://docs.lytics.com/",
    "https://docs.zeotap.com/home/en-us/"
]

# Step 1: Extract Links from the Documentation Page
def get_documentation_links(base_url):
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all links within the documentation site
        links = set()
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            if href.startswith('/docs/') and not href.endswith('#'):
                full_url = f"{base_url.rstrip('/')}{href}"
                links.add(full_url)
        
        return list(links)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching links from {base_url}: {e}")
        return []

# Step 2: Scrape Content from Each Documentation Link
def scrape_content(urls):
    scraped_data = []
    
    for url in urls:
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract title, headings, and content paragraphs
            title = soup.find('title').get_text(strip=True) if soup.find('title') else 'No Title'
            headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3'])]
            paragraphs = [p.get_text(strip=True) for p in soup.find_all('p')]

            scraped_data.append({
                'url': url,
                'title': title,
                'headings': headings,
                'content': paragraphs
            })
            
            print(f"Scraped: {url}")
            time.sleep(1)  # Prevent rate-limiting
        
        except requests.exceptions.RequestException as e:
            print(f"Error scraping {url}: {e}")
    
    return scraped_data

# Step 3: Clean and Process Extracted Data
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    return text.lower()

def clean_scraped_data(scraped_data):
    for entry in scraped_data:
        entry['content'] = [clean_text(p) for p in entry['content']]
        entry['headings'] = [clean_text(h) for h in entry['headings']]
    return scraped_data

# Step 4: Save Processed Data to JSON File
def save_to_json(data, filename='docs_data.json'):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Data saved to {filename}")

# Step 5: Search Through Documentation Content
def search_docs(query, filename='docs_data.json'):
    with open(filename, 'r') as f:
        data = json.load(f)

    results = []
    for doc in data:
        combined_content = " ".join(doc['headings'] + doc['content'])
        match, score = process.extractOne(query, [combined_content])
        if score > 50:  # Minimum threshold to filter relevant matches
            results.append({'url': doc['url'], 'title': doc['title'], 'match': match, 'score': score})

    return results

# -------------------- MAIN SCRIPT --------------------

# 1. Extract documentation links for each documentation site
print("Extracting links from the documentation sites...")
doc_links = []
for url in urls:
    doc_links.extend(get_documentation_links(url))

if not doc_links:
    print("No documentation links found. Exiting.")
    exit()

print(f"Found {len(doc_links)} documentation links.")

# 2. Scrape content from the extracted links
print("Scraping content from documentation links...")
scraped_data = scrape_content(doc_links)

# 3. Clean the scraped content
print("Cleaning the scraped content...")
cleaned_data = clean_scraped_data(scraped_data)

# 4. Save cleaned data
save_to_json(cleaned_data)

# 5. Search for a query
print("\nSearch Example:")
query = "How to integrate with third-party platforms?"
search_results = search_docs(query)

if search_results:
    for result in search_results:
        print(f"Found match in: {result['url']}")
        print(f"Title: {result['title']}")
        print(f"Snippet: {result['match'][:300]}...")
else:
    print("No relevant results found.")
