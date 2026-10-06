import os 
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext


SECRET_KEY =  os.getenv("JWT_SECRET", "dev-secret-change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


if __name__ == "__main__":
    pwd = "hunter2"
    hashed = hash_password(pwd)
    print(f"Hash: {hashed}")
    print(f"Correct password verifies: {verify_password(pwd, hashed)}")
    print(f"Wrong password verifies: {verify_password('wrong', hashed)}")

    token = create_access_token("test-user-id")
    print(f"Token: {token}")
    print(f"Decoded: {decode_access_token(token)}")
    print(f"Bad token: {decode_access_token('not-a-token')}")

