from spyne import rpc, ServiceBase, Iterable, Unicode, Float


class RoadService(ServiceBase):

    @rpc(Unicode, Unicode, Unicode, _returns=Float)
    def road(self, duration, charging_time, breaks):
        duration = float(duration)
        charging_time = float(charging_time)
        breaks = float(breaks)

        total_time = duration + (charging_time * breaks)

        return total_time

