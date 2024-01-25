from spyne import rpc, ServiceBase, Iterable, Unicode


class RoadService(ServiceBase):

    @rpc(Unicode, Unicode, Unicode, Unicode, _returns=Unicode)
    def road(self, distance, duration, autonomy, charging_speed):
        print(distance, duration, autonomy, charging_speed)
        distance = float(distance)
        duration = float(duration)
        autonomy = float(autonomy)
        charging_speed = float(charging_speed)

        charging_time = (distance - autonomy) / charging_speed

        total_time = int(duration + charging_time)

        return str(total_time)

