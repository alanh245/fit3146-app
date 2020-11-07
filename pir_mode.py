import neopixel
import board
from gpiozero import LED, MotionSensor
import time

print ("Sensor initializing . . .")
time.sleep(2) #Give sensor time to startup
print ("Active")
print ("Press Ctrl+c to end program")

pir = MotionSensor(14)
pir.wait_for_no_motion()

# Variables to hold current and last state
currentState = False
previousState = False

# Initialise LED Strip and pixels array to hold colour values
pixels = neopixel.NeoPixel(board.D18, 24)
pixels[0] = (255, 0, 0)

try:
    while True:
        # Read PIR state
        currentState = pir.motion_detected
        
        # If the PIR is triggered
        if currentState == True and previousState == False:
            print("Motion detected")
            # Save detected as previous state
            previousState = True
            # Change LED strip colour to Red
            pixels.fill((255, 0, 0))
            pixels.show()
        # IF the PIR has returned to ready state
        elif currentState == False and previousState == True:
            print ("No motion")
            # Save no motion as previous state
            prviousState = False
            # Change LED strip colour to Red
            pixels.fill((0, 255, 0))
            pixels.show()
            previousState = False
        # Wait for 1 second
        time.sleep(1)

except KeyboardInterrupt: #Ctrl+c
    pass #Do nothing, continue to finally

finally:
    # Set LED to show nothing (off) on closure
    pixels.fill((0, 0, 0))
    pixels.show()
    print ("Program ended")
