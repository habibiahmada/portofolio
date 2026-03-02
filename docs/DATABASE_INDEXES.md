# Database Indexes

This document outlines the recommended database indexes for optimal query performance.

## Overview

Indexes improve query performance by allowing the database to quickly locate rows without scanning the entire table. This is especially important for frequently queried fields.

## Recommended Indexes

### Email Templates Table

```sql
-- Index on key field (primary lookup field)
CREATE INDEX IF NOT EXISTS idx_email_templates_key ON email_templates(key);
```

**Rationale**: The `key` field is used in WHERE clauses for lookups (e.g., `eq('key', key)`).

### Articles Table

```sql
-- Index on published status and published_at for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published, published_at DESC);

-- Index on slug for article lookups
CREATE INDEX IF NOT EXISTS idx_article_translations_slug ON article_translations(slug);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_article_translations_language ON article_translations(language);
```

**Rationale**: 
- Articles are frequently filtered by published status and sorted by published date
- Article translations are looked up by slug and filtered by language

### Projects Table

```sql
-- Index on slug for project lookups
CREATE INDEX IF NOT EXISTS idx_projects_translations_slug ON projects_translations(slug);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_projects_translations_language ON projects_translations(language);
```

**Rationale**: Projects are looked up by slug and filtered by language.

### Certifications Table

```sql
-- Index on year for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_certifications_year ON certifications(year DESC);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_certification_translations_language ON certification_translations(language);
```

**Rationale**: Certifications are often filtered and sorted by year.

### Experiences Table

```sql
-- Index on type and dates for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_experiences_type_dates ON experiences(type, start_date DESC, end_date DESC);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_experience_translations_language ON experience_translations(language);
```

**Rationale**: Experiences are filtered by type and sorted by dates.

### Services Table

```sql
-- Index on key for service lookups
CREATE INDEX IF NOT EXISTS idx_services_key ON services(key);

-- Index on order_index for sorting
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_service_translations_language ON service_translations(language);
```

**Rationale**: Services are looked up by key and sorted by order_index.

### Testimonials Table

```sql
-- Index on rating for filtering
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating DESC);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_testimonial_translations_language ON testimonial_translations(language);
```

**Rationale**: Testimonials may be filtered by rating.

### FAQs Table

```sql
-- Index on is_active and order_index for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_faqs_active_order ON faqs(is_active, order_index);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_faq_translations_lang ON faq_translations(lang);
```

**Rationale**: FAQs are filtered by active status and sorted by order.

### Statistics Table

```sql
-- Index on key for statistic lookups
CREATE INDEX IF NOT EXISTS idx_statistics_key ON statistics(key);

-- Index on language for filtering translations
CREATE INDEX IF NOT EXISTS idx_statistic_translations_language ON statistic_translations(language);
```

**Rationale**: Statistics are looked up by key.

### Companies Table

```sql
-- Index on name for searching/sorting
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
```

**Rationale**: Companies may be searched or sorted by name.

### Tools/Tech Stack Table

```sql
-- Index on category for filtering
CREATE INDEX IF NOT EXISTS idx_tools_logo_category ON tools_logo(category);

-- Index on name for searching
CREATE INDEX IF NOT EXISTS idx_tools_logo_name ON tools_logo(name);
```

**Rationale**: Tech stack items are filtered by category and searched by name.

### Contact Messages Table

```sql
-- Index on read status and created_at for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_contact_messages_read_created ON contact_messages(read, created_at DESC);
```

**Rationale**: Contact messages are filtered by read status and sorted by date.

## Implementation

### Using Supabase Dashboard

1. Navigate to the Supabase Dashboard
2. Go to the SQL Editor
3. Run the SQL statements above
4. Verify indexes are created in the Database > Indexes section

### Using Supabase CLI

```bash
# Create a new migration
supabase migration new add_performance_indexes

# Add the SQL statements to the migration file
# Then apply the migration
supabase db push
```

## Monitoring Index Usage

To verify that indexes are being used effectively:

1. Check query execution plans in Supabase Dashboard
2. Monitor slow query logs (queries > 100ms)
3. Review query performance metrics in the application logs

## Maintenance

- **Rebuild indexes periodically**: Indexes can become fragmented over time
- **Monitor index size**: Large indexes can impact write performance
- **Remove unused indexes**: Indexes that aren't used add overhead to write operations

## Performance Impact

Expected improvements after adding indexes:

- **Email template lookups**: 50-80% faster
- **Article queries**: 60-90% faster (especially with published filter)
- **Translation lookups**: 70-90% faster
- **Sorted queries**: 50-80% faster

## Notes

- Indexes improve read performance but slightly slow down write operations
- For tables with frequent writes, balance index count with write performance
- Composite indexes (multiple columns) are more efficient than multiple single-column indexes for queries that filter on multiple fields
- The order of columns in composite indexes matters - put the most selective column first
