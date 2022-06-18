import requests
import time
import threading
import board
import adafruit_dht
import psutil
import digitalio
import pwmio
from adafruit_motor import servo
from pinsMap import pinsMap
#from digitalio import DigitalInOut, Direction, Pull


# We first check if a libgpiod process is running. If yes, we kill it!
for proc in psutil.process_iter():
    if proc.name() == 'libgpiod_pulsein' or proc.name() == 'libgpiod_pulsei':
        proc.kill()

req_body = {}
set_pins = [16, 24, 26, 28, 32, 36, 38, 40]
data = []
prev_servo_angle = 0

# temp sensor pin: pin 16
sensor = adafruit_dht.DHT11(board.D23)
servo_state = False

# servo pin
garage_servo = servo.Servo(pinsMap["36"])

# connection indication pin
disconnected_led = pinsMap["40"]
disconnected_led.direction =  digitalio.Direction.OUTPUT

# Parking Ultrasonic pin
parking_slot1 = pinsMap["38"]
parking_slot1.direction =  digitalio.Direction.INPUT

# pump pin
pump_state = False
pump = pinsMap["28"]
pump.direction =  digitalio.Direction.OUTPUT

# moisture sensor pin
moisture_sensor = pinsMap["32"]
moisture_sensor.direction =  digitalio.Direction.INPUT

# push button for bell
bell_state = False
bell_button =  pinsMap["26"]
bell_button.direction =  digitalio.Direction.INPUT
bell_button.pull = digitalio.Pull.UP

# buzzer for bell sound after pressing the push button
buzzer =  pinsMap["24"]
buzzer.direction =  digitalio.Direction.OUTPUT


# pin 22 for (+ve) ir
# pin 18 for (-ve) ir
# Room door Ultrasonic pins
ppl_counter = 0
pos_ir = pinsMap["22"]
pos_ir.direction =  digitalio.Direction.INPUT
neg_ir = pinsMap["18"]
neg_ir.direction =  digitalio.Direction.INPUT



def apply_to_pins():
    global ppl_counter

    if(data["reset_ppl"]):
        ppl_counter = 0

    for pin in data["res_pin"]:
        str_pin = str(pin["pin_num"])

        if not pin["pin_num"] in set_pins:
            pinsMap[str_pin].direction = digitalio.Direction.OUTPUT
            set_pins.append(pin["pin_num"])

        if pin["state"]:
            pinsMap[str_pin].value = True
        else:
            pinsMap[str_pin].value = False




def get_data(req_body):
    global data
    URL = "https://ecen-smart-home.herokuapp.com/board"
    Params = {}
    req = requests.get(url=URL, params=Params, json=req_body)
    data = req.json()
    print(data)
    apply_to_pins()


def pump_func():
    global pupm, pump_state, moisture_sensor
    pump_state = True

    print("Moisture", moisture_sensor.value)
    if(moisture_sensor.value):
        pump.value = True
    else:
        pump.value = False

    pump_state = False



def check_servo():
    global data, prev_servo_angle, garage_servo, servo_state
    servo_state = True

    if(data["servo_angle"] > 0 and prev_servo_angle == 0):
        for angle in range(0, 140, 1):  # 0 - 180 degrees, 5 degrees at a time.
            garage_servo.angle = angle
            time.sleep(0.005)
    elif (data["servo_angle"] == 0 and prev_servo_angle > 0):
        for angle in range(140, 0, -1): # 180 - 0 degrees, 5 degrees at a time.
            garage_servo.angle = angle
            time.sleep(0.005)

    prev_servo_angle = data["servo_angle"]
    servo_state = False



def check_bell():
    global bell_button, buzzer, bell_state
    bell_state = True

    if not bell_button.value:
        requests.post(url="https://ecen-smart-home.herokuapp.com/board/bell")
        while not bell_button.value:
            buzzer.value = True
        buzzer.value = False
    
    bell_state = False



def check_door_ir():
    global pos_ir, neg_ir, ppl_counter

    if(not pos_ir.value):
        print("add person")
        ppl_counter += 1
    elif(ppl_counter > 0 and not neg_ir.value):
        ppl_counter -= 1
        print("remove person")





while(True):
    try:
        req_body = {
            'home_temp': sensor.temperature,
            'home_humidity': sensor.humidity,
            'slot1_availability': parking_slot1.value,
            'moisture_sensor': not moisture_sensor.value,
            'ppl_counter': ppl_counter,
        }
    except Exception as error:
        print(error.args[0])
        #continue

    try:
        get_data(req_body)
        disconnected_led.value = False

        servo_thread = threading.Thread(target=check_servo)
        if(not servo_state): 
            servo_thread.start()


        buzzer_thread = threading.Thread(target=check_bell)
        if(not bell_button.value and not bell_state):
            buzzer_thread.start()


        # if moisture = False: enable the pump on pin 28
        """
        pump_thread = threading.Thread(target=pump_func)
        if(not pump_state):
            pump_thread.start()
            """
        pump_func()

        check_door_ir()

    except Exception:
        disconnected_led.value = True
        continue

    print(parking_slot1.value)
    #time.sleep(0.3)

