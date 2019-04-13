# Lumen Trigger Update Alternative
Trigger update dataset on Akvo Lumen using headless browser. 

## Requirements 
- Python 3.6
- Chrome v73
- [Chrome Driver v73]('https://chromedriver.storage.googleapis.com/index.html?path=73.0.3683.68/')

## Usage 

1. Manual Trigger
```
# Export Credential
export KEYCLOAK_USER="YOUR_KEYCLOAK_USER"
export KEYCLOAK_PWD="YOUR_KEYCLOAK_PWD"

# Install Dependencies 
pip install -r requirements

# Run the app 
python app.py
```

2. Using Docker
```
# Export Credential
export KEYCLOAK_USER="YOUR_KEYCLOAK_USER"
export KEYCLOAK_PWD="YOUR_KEYCLOAK_PWD"

# Build Dockerfile
Docker build -t docker-selenium:anu-trigger --build-arg USER=$KEYCLOAK_USER --build-arg PWD=$KEYCLOAK_PWD

# Run Docker
Docker run --rm docker-selenium:anu-trigger
```
