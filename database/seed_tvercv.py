# pip install psycopg2-binary
"""
============================================================
TverCV Database Seeder
============================================================

This script populates the following tables:

- users
- resumes
- education
- experience
- projects
- skills

Recommended for:
- Database performance testing
- Query optimization
- Index benchmarking
- JOIN benchmarking

Author: Your Name
============================================================
"""

import uuid
import random
import psycopg2
from psycopg2.extras import execute_values

# ============================================================
# DATABASE CONFIGURATION
# ============================================================

DB_CONFIG = {
    "host": "localhost",
    "database": "TverCv_db",
    "user": "postgres",
    "password": "123",
    "port": 5432
}

# ============================================================
# DATASET SIZE
# ============================================================

NUM_USERS = 10_000
NUM_RESUMES = 20_000
NUM_EDUCATION = 40_000
NUM_EXPERIENCE = 60_000
NUM_PROJECTS = 40_000
NUM_SKILLS = 100_000

BATCH_SIZE = 5000

# ============================================================
# SAMPLE DATA
# ============================================================

FIRST_NAMES = [
    "John", "Jane", "Michael", "David",
    "Emma", "Sophia", "Olivia", "Daniel"
]

LAST_NAMES = [
    "Smith", "Johnson", "Brown",
    "Davis", "Wilson", "Taylor"
]

SKILLS = [
    "Python", "Java", "C++", "React",
    "Node.js", "PostgreSQL", "Docker",
    "AWS", "Git", "JavaScript"
]

DEGREES = [
    "Bachelor",
    "Master",
    "Associate"
]

COMPANIES = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix"
]

PROJECT_TYPES = [
    "Web Application",
    "Mobile App",
    "Research",
    "Academic"
]

# ============================================================
# CONNECT DATABASE
# ============================================================

print("Connecting to PostgreSQL...")

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

print("Connected!")

# ============================================================
# USERS
# ============================================================

print("\nGenerating Users...")

user_ids = []

for batch in range(0, NUM_USERS, BATCH_SIZE):

    rows = []

    for i in range(batch, min(batch + BATCH_SIZE, NUM_USERS)):

        user_id = str(uuid.uuid4())

        user_ids.append(user_id)

        rows.append(
            (
                user_id,
                f"user{10000000+i}@gmail.com",
                "hashed_password",
                "user"
            )
        )

    execute_values(
        cursor,
        """
        INSERT INTO users
        (id, email, password_hash, role)
        VALUES %s
        """,
        rows
    )

    conn.commit()

print("Users inserted.")

# ============================================================
# RESUMES
# ============================================================

print("\nGenerating Resumes...")

resume_ids = []

for batch in range(0, NUM_RESUMES, BATCH_SIZE):

    rows = []

    for i in range(batch, min(batch + BATCH_SIZE, NUM_RESUMES)):

        resume_id = str(uuid.uuid4())

        resume_ids.append(resume_id)

        rows.append(
            (
                resume_id,
                random.choice(user_ids),
                f"Resume {i}",
                False,
                None,
                "classic",
                "#3B82F6",
                ""
            )
        )

    execute_values(
        cursor,
        """
        INSERT INTO resumes
        (
            id,
            user_id,
            title,
            is_public,
            public_slug,
            template,
            accent_color,
            professional_summary
        )
        VALUES %s
        """,
        rows
    )

    conn.commit()

print("Resumes inserted.")

# ============================================================
# EDUCATION
# ============================================================

print("\nGenerating Education...")

for batch in range(0, NUM_EDUCATION, BATCH_SIZE):

    rows = []

    for _ in range(BATCH_SIZE):

        rows.append(
            (
                str(uuid.uuid4()),
                random.choice(resume_ids),
                random.randint(1, 5),
                "University of Technology",
                random.choice(DEGREES),
                "Software Engineering",
                "2025",
                "3.5"
            )
        )

    execute_values(
        cursor,
        """
        INSERT INTO education
        (
            id,
            resume_id,
            position,
            institution,
            degree,
            field,
            graduation_date,
            gpa
        )
        VALUES %s
        """,
        rows
    )

    conn.commit()

print("Education inserted.")

# ============================================================
# EXPERIENCE
# ============================================================

print("\nGenerating Experience...")

for batch in range(0, NUM_EXPERIENCE, BATCH_SIZE):

    rows = []

    for _ in range(BATCH_SIZE):

        rows.append(
            (
                str(uuid.uuid4()),
                random.choice(resume_ids),
                random.randint(1, 10),
                random.choice(COMPANIES),
                "Software Engineer",
                "2023",
                "2025",
                False,
                "Worked on enterprise applications."
            )
        )

    execute_values(
        cursor,
        """
        INSERT INTO experience
        (
            id,
            resume_id,
            position,
            company,
            job_title,
            start_date,
            end_date,
            is_current,
            description
        )
        VALUES %s
        """,
        rows
    )

    conn.commit()

print("Experience inserted.")

# ============================================================
# PROJECTS
# ============================================================

print("\nGenerating Projects...")

for batch in range(0, NUM_PROJECTS, BATCH_SIZE):

    rows = []

    for _ in range(BATCH_SIZE):

        rows.append(
            (
                str(uuid.uuid4()),
                random.choice(resume_ids),
                random.randint(1, 10),
                "Resume Builder System",
                random.choice(PROJECT_TYPES),
                "Full-stack application project."
            )
        )

    execute_values(
        cursor,
        """
        INSERT INTO projects
        (
            id,
            resume_id,
            position,
            name,
            type,
            description
        )
        VALUES %s
        """,
        rows
    )

    conn.commit()

print("Projects inserted.")

# ============================================================
# SKILLS
# ============================================================

print("\nGenerating Skills...")

for batch in range(0, NUM_SKILLS, BATCH_SIZE):

    rows = []

    for _ in range(BATCH_SIZE):

        rows.append(
            (
                str(uuid.uuid4()),
                random.choice(resume_ids),
                random.choice(SKILLS),
                random.choice([
                    "beginner",
                    "intermediate",
                    "advanced",
                    "expert"
                ])
            )
        )

    execute_values(
        cursor,
        """
        INSERT INTO skills
        (
            id,
            resume_id,
            skill_name,
            proficiency
        )
        VALUES %s
        """,
        rows
    )

    conn.commit()

print("Skills inserted.")

# ============================================================
# FINISH
# ============================================================

cursor.close()
conn.close()

print("\n===================================")
print("Database seeding completed!")
print("===================================")