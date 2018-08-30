# Hass.io

Better zigbee, z-wave, bluetooth and more....

This version uses friendly_name to group Hass sensors into one devices

Therefore use customize.yaml and custom attribute homey_device

In addition you can set the capability title by defining homey_title (not working yet for multiple identical capabilities)

Example:

sensor.fibaro_system_fgss101_smoke_sensor_heat:
  homey_device: 'DEVICE NAME FOR DEVICE WITH GROUPED CAPABILITIES'
  homey_title: 'To Hot'

binary_sensor.fibaro_system_fgsd002_smoke_sensor_sensor:
  homey_device: 'DEVICE NAME FOR DEVICE WITH GROUPED CAPABILITIES'
  homey_title: 'Smoke Sensor Status'

# Version 1.0.1

Added icon's for sensors and fixed measure_battery for Deconz devices

# Version 1.0.2

Added measure_power and meter_power for Deconz devices
