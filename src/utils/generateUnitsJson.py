import csv
import json

def convert_csv_to_json(input_file, output_file):
    data_list = []

    # Define helper to handle boolean conversion
    def str_to_bool(val):
        if not val:
            return False
        return val.lower() in ('true', '1', 't', 'y', 'yes')

    # Define helper for nullable strings
    def str_to_nullable(val):
        if not val or val.lower() == 'null' or val.strip() == '':
            return None
        return val

    try:
        with open(input_file, mode='r', encoding='utf-8') as csv_file:
            reader = csv.DictReader(csv_file)
            
            for row in reader:
                # Type casting each field based on your requirements
                formatted_obj = {
                    "type": str(row.get("type", "")),
                    "floorplanId": str(row.get("floorplanId", "")),
                    "title": str(row.get("title", "")),
                    "id": str(row.get("id", "")),
                    "subtitle": str(row.get("subtitle", "")),
                    "terraceSqft": float(row.get("terraceSqft", 0) or 0),
                    "balconySqft": float(row.get("balconySqft", 0) or 0),
                    "archSqft": float(row.get("archSqft", 0) or 0),
                    "mktgSqft": int(float(row.get("mktgSqft", 0) or 0)),
                    "numOfBeds": int(float(row.get("numOfBeds", 0) or 0)),
                    "numOfBaths": int(float(row.get("numOfBaths", 0) or 0)),
                    "balcony": str_to_bool(row.get("balcony", "")),
                    "terrace": str_to_bool(row.get("terrace", "")),
                    "tub": str_to_bool(row.get("tub", "")),
                    "pantry": str_to_bool(row.get("pantry", "")),
                    "powderRoom": str_to_bool(row.get("powderRoom", "")),
                    "office": str_to_bool(row.get("office", "")),
                    "walkInCloset": str_to_bool(row.get("walkInCloset", "")),
                    "barrierFree": str_to_bool(row.get("barrierFree", "")),
                    "builtIns": str_to_bool(row.get("builtIns", "")),
                    "juliet": str_to_bool(row.get("juliet", "")),
                    "image": str_to_nullable(row.get("image")),
                    "virtualTour": str_to_nullable(row.get("virtualTour")),
                    "pdf": str_to_nullable(row.get("pdf"))
                }
                data_list.append(formatted_obj)

        with open(output_file, mode='w', encoding='utf-8') as json_file:
            json.dump(data_list, json_file, indent=4)
            
        print(f"Successfully converted {input_file} to {output_file}")

    except FileNotFoundError:
        print(f"Error: The file {input_file} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Usage
if __name__ == "__main__":
    convert_csv_to_json('units.csv', 'units.json')