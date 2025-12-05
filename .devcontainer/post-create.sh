#!/bin/bash
echo "Installing Backend Dependencies..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo "Setup Complete! Run the servers securely in new terminals."
