from spyne.application import Application
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
from wsgiref.simple_server import make_server

from CORSMiddleware import CORSMiddleware
from roadService import RoadService

application = Application([RoadService], 'spyne.getTime',
                          in_protocol=Soap11(validator='lxml'),
                          out_protocol=Soap11()
                          )

wsgi_application = WsgiApplication(application)
app_with_cors = CORSMiddleware(wsgi_application)

server = make_server('127.0.0.1', 8001, app_with_cors)

print("Server started at http://")

server.serve_forever()
