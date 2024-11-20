from flask import Flask, request, jsonify, send_file, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import fitz  # PyMuPDF
import logging
from PIL import Image
import io
import time

# Configurazione logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configurazione per l'ambiente di produzione
if os.getenv('RAILWAY_ENVIRONMENT'):
    app.config['UPLOAD_FOLDER'] = '/tmp/uploads'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit
else:
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

# Assicurati che la cartella uploads esista
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_pdf_to_images(pdf_path, unique_id):
    """Converte le pagine del PDF in immagini."""
    try:
        logger.info(f"Converting PDF to images: {pdf_path}")
        doc = fitz.open(pdf_path)
        images = []
        
        # Crea una directory specifica per questo upload
        upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], unique_id)
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            logger.info(f"Created directory for upload: {upload_dir}")
        
        for page_num in range(len(doc)):
            logger.info(f"Processing page {page_num + 1}/{len(doc)}")
            page = doc[page_num]
            
            # Aumenta la risoluzione dell'immagine
            zoom = 2  # fattore di zoom per aumentare la qualità
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat, alpha=False)
            
            # Converti in formato PIL Image
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            # Salva l'immagine nella directory specifica dell'upload
            image_filename = f"page_{page_num + 1}.png"
            image_path = os.path.join(upload_dir, image_filename)
            img.save(image_path, "PNG", quality=95)
            
            # Aggiungi il percorso relativo all'array
            images.append(f"/api/preview/{unique_id}/{image_filename}")
            logger.info(f"Created image: {image_path}")
        
        logger.info(f"Successfully converted {len(images)} pages")
        return images
    except Exception as e:
        logger.error(f"Error converting PDF: {str(e)}")
        return []

@app.route('/api/upload', methods=['POST'])
def upload_file():
    logger.info("Received upload request")
    
    if 'file' not in request.files:
        logger.error("No file part in request")
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Genera un ID univoco per questo upload
            timestamp = int(time.time())
            unique_id = f"{timestamp}_{secure_filename(os.path.splitext(file.filename)[0])}"
            logger.info(f"Generated unique ID: {unique_id}")
            
            # Salva il file PDF
            pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}.pdf")
            logger.info(f"Saving PDF to: {pdf_path}")
            file.save(pdf_path)
            logger.info("PDF saved successfully")
            
            # Converti il PDF in immagini
            preview_images = convert_pdf_to_images(pdf_path, unique_id)
            
            if not preview_images:
                logger.error("Failed to process PDF")
                return jsonify({'error': 'Failed to process PDF'}), 500
            
            logger.info(f"Successfully processed PDF with {len(preview_images)} pages")
            return jsonify({
                'success': True,
                'filename': unique_id,
                'previews': preview_images,
                'totalPages': len(preview_images)
            })
            
        except Exception as e:
            logger.error(f"Error processing upload: {str(e)}")
            return jsonify({'error': str(e)}), 500
            
    logger.error("Invalid file type")
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/preview/<path:filename>', methods=['GET'])
def get_preview(filename):
    try:
        # Costruisci il percorso completo al file
        if '/' in filename:
            # Se il filename contiene una directory
            unique_id, image_name = filename.split('/', 1)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_id, image_name)
        else:
            # Fallback per compatibilità
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        logger.info(f"Serving preview image: {file_path}")
        
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(file_path, mimetype='image/png')
    except Exception as e:
        logger.error(f"Error serving preview: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5002...")
    app.run(debug=True, port=5002)
