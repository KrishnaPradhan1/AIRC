import os
import re

def fix_imports(directory):
    # Regex to match package@version in imports
    # e.g., class-variance-authority@0.7.1 -> class-variance-authority
    # e.g., @radix-ui/react-slot@1.1.2 -> @radix-ui/react-slot
    pattern = re.compile(r'([a-z0-9@/-]+)@\d+\.\d+\.\d+')
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # We only want to replace inside import statements or require calls ideally,
                # but a global replace of "pkg@ver" to "pkg" is likely safe for this codebase
                # as long as we are careful.
                # To be safer, let's target strings inside quotes.
                
                def replace_match(match):
                    return match.group(1)
                
                new_content = pattern.sub(replace_match, content)
                
                if new_content != content:
                    print(f"Fixing imports in {filepath}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    target_dir = r"d:\PROJECT\AI_BASED_RESUME_CLASSIFIER_USING_LLM\AI_Resume_Classifier\frontend\src\components\ui"
    fix_imports(target_dir)
