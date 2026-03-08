from PIL import Image, ImageDraw

def replace_background():
    # Open image
    img = Image.open('d:\\Civil\\tn.jpg')
    img = img.convert("RGB")
    
    # Get image dimensions
    w, h = img.size
    
    # Floodfill from all 4 corners with white color
    ImageDraw.floodfill(img, xy=(0, 0), value=(255, 255, 255), thresh=50)
    ImageDraw.floodfill(img, xy=(w-1, 0), value=(255, 255, 255), thresh=50)
    ImageDraw.floodfill(img, xy=(0, h-1), value=(255, 255, 255), thresh=50)
    ImageDraw.floodfill(img, xy=(w-1, h-1), value=(255, 255, 255), thresh=50)
    
    # Save the result
    img.save('d:\\Civil\\tn_white.jpg', quality=95)
    print("Background replaced successfully.")

if __name__ == "__main__":
    replace_background()
