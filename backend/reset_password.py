"""Admin password reset / lockout recovery.

Run this if you are locked out of the admin dashboard.

  Local (Windows):   double-click  reset-password.bat   in the project root
  Local (manual):    set DATABASE_URL, then  python reset_password.py
  Docker/production: docker compose exec backend python reset_password.py

It lists the admin accounts, lets you pick one, and sets a new password.
"""
import getpass
import sys

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import User


def main() -> int:
    db = SessionLocal()
    try:
        users = db.query(User).order_by(User.id).all()
        if not users:
            print("No admin accounts exist in the database.")
            return 1

        print("\nAdmin accounts:")
        for u in users:
            print(f"  - {u.email}  ({u.role})")

        if len(users) == 1:
            email = users[0].email
            print(f"\nResetting password for: {email}")
        else:
            email = input("\nEnter the email to reset: ").strip()

        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"No account found for '{email}'.")
            return 1

        try:
            pw1 = getpass.getpass("New password (min 6 chars): ")
            pw2 = getpass.getpass("Confirm new password: ")
        except Exception:
            # Fallback for terminals without hidden input
            pw1 = input("New password (min 6 chars): ")
            pw2 = input("Confirm new password: ")

        if len(pw1) < 6:
            print("Password must be at least 6 characters. Nothing changed.")
            return 1
        if pw1 != pw2:
            print("Passwords do not match. Nothing changed.")
            return 1

        user.hashed_password = hash_password(pw1)
        db.commit()
        print(f"\n✓ Password for {email} has been reset. You can now log in.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    sys.exit(main())
