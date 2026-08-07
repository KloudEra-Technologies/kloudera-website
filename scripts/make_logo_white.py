from PIL import Image

def make_logo_white(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        # Check if the pixel is dark (like black or dark blue text)
        # We define dark as R < 60, G < 60, B < 80 (since dark blue has low R and G)
        if r < 65 and g < 65 and b < 100 and a > 30:
            # Change to white
            new_data.append((255, 255, 255, a))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path)
    print(f"White logo generated and saved to {output_path}")

if __name__ == '__main__':
    make_logo_white('KlouderaNewLogo-removebg-preview.png', 'KlouderaNewLogo-white.png')
