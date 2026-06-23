"""Idempotent seed data so the platform looks alive on first run.

Demo imagery uses Unsplash source URLs; firms replace everything from the
admin dashboard. Multilingual fields include EN / AR / KMR (Kurdish Badini).
"""
import logging

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import (
    Award,
    BlogPost,
    Category,
    Client,
    JobPosting,
    Project,
    ProjectMedia,
    Service,
    SiteSettings,
    TeamMember,
    User,
)

logger = logging.getLogger("seed")

IMG = "https://images.unsplash.com/photo-{}?auto=format&fit=crop&w=1600&q=80"
PHOTOS = {
    "tower": "1486406146926-c627a92ad1ab",
    "villa": "1512917774080-9991f1c4c750",
    "museum": "1518005020951-eccb494ad742",
    "pavilion": "1469474968028-56623f02e42e",
    "office": "1497366216548-37526070297c",
    "interior": "1505691938895-1758d7feb511",
    "person1": "1500648767791-00dcc994a43e",
    "person2": "1494790108377-be9c29b29330",
    "person3": "1507003211169-0a1dd7228f2d",
}


def t(en, ar, kmr):
    return {"en": en, "ar": ar, "kmr": kmr}


def seed():
    db = SessionLocal()
    try:
        if not db.query(User).first():
            db.add(
                User(
                    email=settings.FIRST_ADMIN_EMAIL,
                    full_name="Studio Administrator",
                    hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
                    role="superadmin",
                )
            )
            logger.info("Seeded admin user: %s", settings.FIRST_ADMIN_EMAIL)

        if not db.query(SiteSettings).first():
            db.add(
                SiteSettings(
                    company_name=t("ARCHIPELAGO", "أرخبيل", "ARCHIPELAGO"),
                    tagline=t(
                        "Architecture of light, space & silence",
                        "عمارة الضوء والفراغ والسكون",
                        "Avahîsaziya ronahî, valahî û bêdengiyê",
                    ),
                    hero_title=t(
                        "We shape spaces that outlive us",
                        "نصمم مساحات تتجاوز الزمن",
                        "Em cîhan ava dikin ku ji me dirêjtir bijîn",
                    ),
                    hero_subtitle=t(
                        "An award-winning architecture studio crafting timeless environments.",
                        "استوديو معماري حائز على جوائز يصمم بيئات خالدة.",
                        "Studyoyek avahîsaziyê ya xelatgirtî.",
                    ),
                    hero_poster_url=IMG.format(PHOTOS["tower"]),
                    hero_video_url="",
                    email="studio@archipelago.com",
                    phone="+964 750 000 0000",
                    address=t("Erbil, Kurdistan Region", "أربيل، إقليم كردستان", "Hewlêr, Herêma Kurdistanê"),
                    social_links=[
                        {"platform": "instagram", "url": "https://instagram.com"},
                        {"platform": "linkedin", "url": "https://linkedin.com"},
                        {"platform": "behance", "url": "https://behance.net"},
                    ],
                    seo_title=t(
                        "Archipelago — Architecture Studio",
                        "أرخبيل — استوديو معماري",
                        "Archipelago — Studyoya Avahîsaziyê",
                    ),
                    seo_description=t(
                        "Award-winning architecture and interior design studio.",
                        "استوديو معماري وتصميم داخلي حائز على جوائز.",
                        "Studyoya avahîsazî û sêwirana hundir a xelatgirtî.",
                    ),
                    content={
                        "about": t(
                            "Founded on the belief that architecture is a quiet dialogue between "
                            "light, material and human emotion, our studio designs buildings that "
                            "feel inevitable.",
                            "تأسس على الإيمان بأن العمارة حوار هادئ بين الضوء والمادة والعاطفة الإنسانية.",
                            "Em bawer dikin ku avahîsazî diyalogek bêdeng e di navbera ronahî û mirovan de.",
                        ),
                        "stats": [
                            {"value": "180+", "label": t("Projects", "مشروع", "Proje")},
                            {"value": "24", "label": t("Awards", "جائزة", "Xelat")},
                            {"value": "15", "label": t("Years", "سنة", "Sal")},
                            {"value": "9", "label": t("Countries", "دولة", "Welat")},
                        ],
                    },
                )
            )
            logger.info("Seeded site settings.")

        if not db.query(Category).first():
            cats = [
                Category(slug="residential", name=t("Residential", "سكني", "Niştecîh"), order=1),
                Category(slug="commercial", name=t("Commercial", "تجاري", "Bazirganî"), order=2),
                Category(slug="cultural", name=t("Cultural", "ثقافي", "Çandî"), order=3),
                Category(slug="interior", name=t("Interior", "داخلي", "Hundir"), order=4),
            ]
            db.add_all(cats)
            db.flush()

            demo = [
                ("aurora-tower", "Aurora Tower", "commercial", PHOTOS["tower"], "Dubai, UAE", 2024, True),
                ("serpentine-villa", "Serpentine Villa", "residential", PHOTOS["villa"], "Erbil, KRG", 2023, True),
                ("museum-of-light", "Museum of Light", "cultural", PHOTOS["museum"], "Doha, Qatar", 2023, True),
                ("forest-pavilion", "Forest Pavilion", "cultural", PHOTOS["pavilion"], "Oslo, Norway", 2022, False),
                ("monolith-offices", "Monolith Offices", "commercial", PHOTOS["office"], "London, UK", 2024, False),
                ("travertine-loft", "Travertine Loft", "interior", PHOTOS["interior"], "Milan, Italy", 2023, True),
            ]
            cat_by_slug = {c.slug: c for c in cats}
            for i, (slug, title, cslug, photo, loc, year, feat) in enumerate(demo):
                proj = Project(
                    slug=slug,
                    title={"en": title, "ar": title, "kmr": title},
                    subtitle=t("Architecture & Interior", "عمارة وتصميم داخلي", "Avahîsazî û Hundir"),
                    description=t(
                        "A study in proportion, material honesty and the choreography of natural light.",
                        "دراسة في التناسب وصدق المواد ورقصة الضوء الطبيعي.",
                        "Lêkolînek di pîvan û rastiya maddî de.",
                    ),
                    category_id=cat_by_slug[cslug].id,
                    cover_url=IMG.format(photo),
                    hero_url=IMG.format(photo),
                    location=loc,
                    year=year,
                    area_sqm=1200 + i * 800,
                    client_name="Private Client",
                    is_featured=feat,
                    order=i,
                    stats=[
                        {"value": str(year), "label": t("Year", "السنة", "Sal")},
                        {"value": f"{1200 + i*800} m²", "label": t("Area", "المساحة", "Rûbar")},
                    ],
                )
                db.add(proj)
                db.flush()
                for k in range(3):
                    db.add(ProjectMedia(project_id=proj.id, kind="image", url=IMG.format(photo), order=k))
            logger.info("Seeded demo projects.")

        if not db.query(TeamMember).first():
            db.add_all([
                TeamMember(name="Lena Marwan", position=t("Founder & Principal", "المؤسِّسة والمديرة", "Damezrîner"), bio=t("Lena leads the studio's vision.", "تقود لينا رؤية الاستوديو.", "Lena pêşengê studyoyê ye."), photo_url=IMG.format(PHOTOS["person2"]), order=1, social_links=[{"platform": "linkedin", "url": "#"}]),
                TeamMember(name="Daniel Roth", position=t("Design Director", "مدير التصميم", "Derhênerê Sêwiranê"), bio=t("Daniel directs design across all scales.", "يدير دانيال التصميم.", "Daniel sêwiranê birêve dibe."), photo_url=IMG.format(PHOTOS["person3"]), order=2, social_links=[]),
                TeamMember(name="Sara Khalil", position=t("Head of Interiors", "رئيسة التصميم الداخلي", "Serokê Hundir"), bio=t("Sara crafts interior atmospheres.", "تصمم سارة الأجواء الداخلية.", "Sara hundir sêwirîne."), photo_url=IMG.format(PHOTOS["person1"]), order=3, social_links=[]),
            ])

        if not db.query(Service).first():
            db.add_all([
                Service(title=t("Architecture", "العمارة", "Avahîsazî"), description=t("Full architectural design from concept to completion.", "تصميم معماري كامل.", "Sêwirana avahîsaziyê ya tevahî."), icon="building", order=1),
                Service(title=t("Interior Design", "التصميم الداخلي", "Sêwirana Hundir"), description=t("Bespoke interiors that elevate everyday life.", "تصاميم داخلية مخصصة.", "Hundirên taybet."), icon="sofa", order=2),
                Service(title=t("Masterplanning", "التخطيط العمراني", "Plansaziya Sereke"), description=t("Urban scale planning and feasibility.", "تخطيط على نطاق حضري.", "Plansaziya bajarî."), icon="map", order=3),
                Service(title=t("Consultancy", "الاستشارات", "Şêwirmendî"), description=t("Strategic advisory for complex projects.", "استشارات استراتيجية.", "Şêwirmendiya stratejîk."), icon="compass", order=4),
            ])

        if not db.query(Award).first():
            db.add_all([
                Award(title=t("World Architecture Award", "جائزة العمارة العالمية", "Xelata Avahîsaziya Cîhanî"), organization="WAF", year=2024, order=1),
                Award(title=t("Dezeen Design Prize", "جائزة ديزين", "Xelata Dezeen"), organization="Dezeen", year=2023, order=2),
                Award(title=t("AIA Honor Award", "جائزة AIA", "Xelata AIA"), organization="AIA", year=2022, order=3),
            ])

        if not db.query(Client).first():
            db.add_all([
                Client(name="Emaar", order=1), Client(name="Aga Khan Trust", order=2),
                Client(name="Foster Group", order=3), Client(name="Korek", order=4),
            ])

        if not db.query(BlogPost).first():
            posts = [
                ("the-poetics-of-concrete", "The Poetics of Concrete", "museum"),
                ("designing-with-daylight", "Designing with Daylight", "interior"),
                ("the-future-of-civic-space", "The Future of Civic Space", "pavilion"),
            ]
            for slug, title, photo in posts:
                db.add(BlogPost(
                    slug=slug,
                    title={"en": title, "ar": title, "kmr": title},
                    excerpt=t(
                        "Reflections on material, light and the craft of building.",
                        "تأملات في المادة والضوء وحرفة البناء.",
                        "Ramanên li ser madde, ronahî û hunera avahîsaziyê.",
                    ),
                    body=t(
                        "Architecture begins where engineering meets emotion. In this piece we explore "
                        "how restraint, proportion and natural light combine to create spaces that move people.\n\n"
                        "Great buildings are not designed to impress — they are designed to endure.",
                        "تبدأ العمارة حيث تلتقي الهندسة بالعاطفة.",
                        "Avahîsazî li wir dest pê dike ku endezyarî digihîje hest.",
                    ),
                    cover_url=IMG.format(PHOTOS[photo]),
                    author="Lena Marwan",
                    tags=["design", "philosophy"],
                ))

        if not db.query(JobPosting).first():
            jobs = [
                ("senior-architect", "Senior Architect", "Erbil, KRG", "full-time"),
                ("interior-designer", "Interior Designer", "Remote", "full-time"),
                ("architecture-intern", "Architecture Intern", "Erbil, KRG", "internship"),
            ]
            for slug, title, loc, etype in jobs:
                db.add(JobPosting(
                    slug=slug,
                    title={"en": title, "ar": title, "kmr": title},
                    description=t(
                        "We are seeking a talented individual to join our award-winning studio and "
                        "contribute to projects of international scope.",
                        "نبحث عن موهبة للانضمام إلى استوديونا الحائز على جوائز.",
                        "Em li kesekî jêhatî digerin ku beşdarî studyoya me bibe.",
                    ),
                    location=loc,
                    employment_type=etype,
                ))

        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Seeding failed")
    finally:
        db.close()
