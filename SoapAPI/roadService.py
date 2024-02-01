from spyne import rpc, ServiceBase, Iterable, Unicode, Float


class RoadService(ServiceBase):

    @rpc(Unicode, Unicode, Unicode, _returns=Float)
    def road(self, duration, charging_speed, breaks):
        duration = float(duration)
        charging_speed = float(charging_speed)
        breaks = float(breaks)

        total_time = duration + (charging_speed * breaks)

        return total_time

