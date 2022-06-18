import pwmio
import board
import digitalio


pinsMap = {
    'D0': digitalio.DigitalInOut(board.D0), '28': digitalio.DigitalInOut(board.D1), '19': digitalio.DigitalInOut(board.D10), 
    '23': digitalio.DigitalInOut(board.D11), '32': digitalio.DigitalInOut(board.D12), '33': digitalio.DigitalInOut(board.D13), '8': digitalio.DigitalInOut(board.D14), 
    '10': digitalio.DigitalInOut(board.D15), '36': pwmio.PWMOut(board.D16, duty_cycle=2 ** 15, frequency=50), '11': digitalio.DigitalInOut(board.D17), '12': digitalio.DigitalInOut(board.D18),
    '35': digitalio.DigitalInOut(board.D19), '3': digitalio.DigitalInOut(board.D2), 
    '38': digitalio.DigitalInOut(board.D20), '40': digitalio.DigitalInOut(board.D21), 
    '15': digitalio.DigitalInOut(board.D22), '16': digitalio.DigitalInOut(board.D23), '18': digitalio.DigitalInOut(board.D24), '22': digitalio.DigitalInOut(board.D25), 
    '37': digitalio.DigitalInOut(board.D26), '13': digitalio.DigitalInOut(board.D27), '5': digitalio.DigitalInOut(board.D3), '7': digitalio.DigitalInOut(board.D4), 
    '29': digitalio.DigitalInOut(board.D5), '31': digitalio.DigitalInOut(board.D6), '26': digitalio.DigitalInOut(board.D7), '24': digitalio.DigitalInOut(board.D8), '21': digitalio.DigitalInOut(board.D9)
    }


