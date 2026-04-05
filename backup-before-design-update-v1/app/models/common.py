import datetime as dt


def _utcnow() -> dt.datetime:
    return dt.datetime.now(dt.UTC)
