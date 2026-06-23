"""Image optimization pipeline.

On upload we downscale oversized images and generate a lightweight WebP
thumbnail, so the frontend serves fast, appropriately-sized assets.
"""
import logging
import os

logger = logging.getLogger("image")

MAX_DIMENSION = 2400   # cap the long edge of the stored original
THUMB_WIDTH = 600      # gallery / card thumbnail width
JPEG_QUALITY = 82


def optimize_image(path: str) -> tuple[int | None, int | None, str | None]:
    """Optimize the image at ``path`` in place and write a sibling thumbnail.

    Returns ``(width, height, thumb_path)``. Safe to call on any file —
    non-images or failures return ``(None, None, None)`` and leave the file as-is.
    """
    try:
        from PIL import Image, ImageOps
    except Exception:
        return None, None, None

    try:
        with Image.open(path) as img:
            img = ImageOps.exif_transpose(img)
            fmt = img.format

            # Downscale the original if it exceeds the cap.
            if max(img.size) > MAX_DIMENSION:
                img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

            save_kwargs = {"optimize": True}
            if fmt in ("JPEG", "MPO"):
                save_kwargs["quality"] = JPEG_QUALITY
                img.convert("RGB").save(path, "JPEG", **save_kwargs)
            elif fmt == "PNG":
                img.save(path, "PNG", **save_kwargs)
            elif fmt == "WEBP":
                img.save(path, "WEBP", quality=JPEG_QUALITY)
            else:
                img.save(path)

            width, height = img.size

            # WebP thumbnail.
            thumb = img.copy()
            thumb.thumbnail((THUMB_WIDTH, THUMB_WIDTH), Image.LANCZOS)
            base, _ = os.path.splitext(path)
            thumb_path = f"{base}_thumb.webp"
            thumb.convert("RGB").save(thumb_path, "WEBP", quality=80)

            return width, height, thumb_path
    except Exception:
        logger.exception("Image optimization failed for %s", path)
        return None, None, None
