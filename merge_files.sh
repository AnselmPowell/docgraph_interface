# #!/bin/bash

# # Output file
# OUTPUT_FILE="output.txt"

# # Clear the output file if it exists
# echo "" > "$OUTPUT_FILE"

# # Automatically detect the script's directory as base directory
# BASE_DIR="$(dirname "$(realpath "$0")")"

# # Check if at least one file is provided
# if [ "$#" -eq 0 ]; then
#     echo "Usage: $0 <filename1> <filename2> ..."
#     exit 1
# fi

# # Loop through all provided filenames and search for them in the entire project directory
# for filename in "$@"; do
#     find "$BASE_DIR" -type f -name "$filename" 2>/dev/null | while read -r file_path; do
#         if [ -f "$file_path" ]; then
#             echo "--- Start of $filename ---" >> "$OUTPUT_FILE"
#             cat "$file_path" >> "$OUTPUT_FILE"
#             echo -e "\n--- End of $filename ---\n" >> "$OUTPUT_FILE"
#         fi
#     done

# done

# echo "Matching files merged into $OUTPUT_FILE"



# #!/bin/bash

# # Output file
# OUTPUT_FILE="output.txt"

# # Clear the output file if it exists
# echo "" > "$OUTPUT_FILE"

# # Automatically detect the script's directory as base directory
# BASE_DIR="$(dirname "$(realpath "$0")")"

# # Check if at least one file is provided
# if [ "$#" -eq 0 ]; then
#     echo "Usage: $0 <relative/path/to/file1> <relative/path/to/file2> ..."
#     exit 1
# fi

# # Loop through all provided file paths and search for them in the project directory
# for filepath in "$@"; do
#     file_path=$(find "$BASE_DIR" -type f -path "*/$filepath" 2>/dev/null | head -n 1)
#     if [ -n "$file_path" ]; then
#         echo "--- Start of $filepath ---" >> "$OUTPUT_FILE"
#         cat "$file_path" >> "$OUTPUT_FILE"
#         echo -e "\n--- End of $filepath ---\n" >> "$OUTPUT_FILE"
#     else
#         echo "File not found: $filepath" >> "$OUTPUT_FILE"
#     fi
# done

# echo "Matching files merged into $OUTPUT_FILE"



#!/bin/bash

# Output file
OUTPUT_FILE="output.txt"

# Clear the output file if it exists
echo "" > "$OUTPUT_FILE"

# Automatically detect the script's directory as base directory
BASE_DIR="$(dirname "$(realpath "$0")")"

# Check if at least one file is provided
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <relative/path/to/file1> <relative/path/to/file2> ..."
    exit 1
fi

# Loop through all provided file paths and search for them in the project directory
for filepath in "$@"; do
    file_path=$(find "$BASE_DIR" -type f -path "*/$filepath" ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/.git/*" 2>/dev/null | head -n 1)
    if [ -n "$file_path" ]; then
        echo "--- Start of $filepath ---" >> "$OUTPUT_FILE"
        cat "$file_path" >> "$OUTPUT_FILE"
        echo -e "\n--- End of $filepath ---\n" >> "$OUTPUT_FILE"
    else
        echo "File not found: $filepath" >> "$OUTPUT_FILE"
    fi
done

echo "Matching files merged into $OUTPUT_FILE"

