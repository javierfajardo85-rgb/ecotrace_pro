import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from .config import settings


_requests_by_ip: dict[str, deque[float]] = defaultdict(deque)


def rate_limit(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    window = settings.rate_limit_window_seconds
    max_req = settings.rate_limit_max_requests

    q = _requests_by_ip[ip]
    while q and q[0] < now - window:
        q.popleft()

    if len(q) >= max_req:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    q.append(now)

