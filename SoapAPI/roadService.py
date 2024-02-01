from spyne import rpc, ServiceBase, Iterable, Unicode


class RoadService(ServiceBase):

    @rpc(Unicode, Unicode, Unicode, _returns=Unicode)
    def road(self, duration, charging_speed, breaks):
        duration = float(duration)
        charging_speed = float(charging_speed)
        breaks = float(breaks)

        total_time = duration + (charging_speed * breaks)

        return str(total_time)

