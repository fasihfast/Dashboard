from google import genai
import os

# 1. Setup the AI with your key
# Tip: Replace the text below with your actual API Key from AI Studio
client = genai.Client(api_key="AIzaSyBvi5lmqdv0Eef-wD2qtyLw0-AM2_jw0jY")

def debug_my_code():
    # 2. Look for the codebase file
    file_path = 'repomix-output.txt'
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found!")
        print("FIX: Run 'npx repomix --format text' in this folder first.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        codebase_content = f.read()

    # 3. Get your problem description
    print("\n--- 🕵️ Your AI Debugging Agent is Ready ---")
    user_issue = input("Describe the error or what you want to change: ")

    # 4. Create the prompt (The "Instructions")
    prompt = f"""
    You are an elite Senior Developer. Below is my entire codebase.
    
    MY ISSUE:
    {user_issue}

    YOUR GOAL:
    1. Identify the exact file and the approximate line number of the bug.
    2. Explain why it is happening in 2 sentences.
    3. Provide the full corrected code block so I can copy-paste it.

    CODEBASE START:
    {codebase_content}
    """

    # 5. Send to Gemini (Using the new 2.0 Flash model)
    print("\nThinking... (Analyzing thousands of lines)...")
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=prompt
        )
        
        print("\n" + "="*30)
        print("PROPOSED FIX:")
        print("="*30)
        print(response.text)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    debug_my_code()