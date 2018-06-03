from microbit import *
while True:
    temp = str(temperature())
    display.scroll(temp)
    display.show(Image.HAPPY)
    sleep(3000)
