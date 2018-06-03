from microbit import *

hits = 3

while True:
# pressedは押してる間ずっと    
#    if button_a.is_pressed():
    if button_a.get_presses():
        hits += 1
#        sleep(100)
#    elif button_b.is_pressed():
    elif button_b.get_presses():
        if hits > 3:
            hits -= 1
#            sleep(100)
#        break
    else:
        display.scroll(str(hits))

#display.clear()

