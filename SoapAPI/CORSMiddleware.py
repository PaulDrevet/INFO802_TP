class CORSMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        if environ['REQUEST_METHOD'] == 'OPTIONS':
            start_response(
                '200 OK',
                [('Content-Type', 'text/plain'),
                 ('Access-Control-Allow-Origin', '*'),
                 ('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'),
                 ('Access-Control-Allow-Headers', 'Content-Type')]
            )
            return []

        def custom_start_response(status, headers, exc_info=None):
            headers.append(('Access-Control-Allow-Origin', '*'))
            headers.append(('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'))
            headers.append(('Access-Control-Allow-Headers', 'Content-Type'))
            return start_response(status, headers, exc_info)

        return self.app(environ, custom_start_response)