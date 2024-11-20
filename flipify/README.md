# Flipify

Transform your PDFs into beautiful, interactive flipbooks with Flipify - a modern web application built with React and Flask.

## Features

- 🎨 Modern, minimalist interface
- 📱 Fully responsive design
- 🔄 Smooth page-turning animations
- 📤 Drag and drop PDF upload
- 🖱️ Interactive controls
- 🎭 Beautiful transitions and effects

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- pip (Python package installer)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flipify.git
cd flipify
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows use: venv\Scripts\activate
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click the upload area or drag and drop a PDF file
3. Wait for the conversion process to complete
4. Use the on-screen controls or click the page edges to navigate through your flipbook

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
