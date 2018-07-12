python app.py > /dev/null 2>&1 & echo kill $! '\n' rm kill.sh > kill.sh
echo '* Running on http://127.0.0.1:5000/'
echo '* type $ sh kill.sh to stop the program'
