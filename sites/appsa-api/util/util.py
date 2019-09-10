from datetime import datetime

class Printer:

    def get_time(self):
        now = datetime.now().time().strftime("%H:%M:%S")
        return now
