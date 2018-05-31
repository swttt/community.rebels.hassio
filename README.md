# Hass.io

Better zigbee, z-wave, bluetooth and more....

This version uses friendly_name to group Hass sensors into one devices

Therefore use customize.yaml and custom attribute homey_device

Example:

sensor.fibaro_system_fgss101_smoke_sensor_heat:
  homey_device: 'DEVICE NAME FOR DEVICE WITH GROUPED CAPABILITIES'

binary_sensor.fibaro_system_fgsd002_smoke_sensor_sensor:
  homey_device: 'DEVICE NAME FOR DEVICE WITH GROUPED CAPABILITIES'
