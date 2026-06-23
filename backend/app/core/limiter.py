"""Shared rate limiter (slowapi) — protects against brute force & form spam."""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["300/minute"])
