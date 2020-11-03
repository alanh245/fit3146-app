import neopixel
import board
from gpiozero import LED
import time


pixels = neopixel.NeoPixel(board.D18, 24)
pixels[0] = (255, 0, 0)

print ("LED red")
pixels.fill((255, 0, 0))
pixels.show()