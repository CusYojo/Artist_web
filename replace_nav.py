import glob
import os

# Rename media to video
if os.path.exists('media.html'):
    os.rename('media.html', 'video.html')

html_files = glob.glob("*.html")

dropdown_html = """<div class="nav-dropdown">
                    <a href="#" class="dropbtn active-exempt">Media <i class="fas fa-caret-down"></i></a>
                    <div class="dropdown-content">
                        <a href="gallery.html">Gallery</a>
                        <a href="video.html">Video</a>
                    </div>
                </div>"""

for f in html_files:
    if f == 'gallery.html': # if it exists
        continue
        
    with open(f, 'r') as file:
        content = file.read()
    
    new_content = content.replace('<a href="media.html">Media</a>', dropdown_html)
    # also change rich-card links from media.html to gallery.html maybe? Yes, Gallery makes more sense for Explore.
    new_content = new_content.replace('<a href="media.html" class="rich-card">', '<a href="gallery.html" class="rich-card">')
    
    with open(f, 'w') as file:
        file.write(new_content)

print("Dropdown logic executed successfully.")
