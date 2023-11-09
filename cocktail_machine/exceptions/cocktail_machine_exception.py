class PumpInUseException(BaseException):
    pass


class BadRequestException(BaseException):
    def __init__(self, message, status):
        self.message = message
        self.status = status
