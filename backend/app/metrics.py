from datetime import date, datetime


def row_date(row, field):
    value = row.get(field)
    if not value:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return datetime.fromisoformat(str(value).replace("Z", "+00:00")).date()


def money(value):
    return round(float(value or 0), 2)


def month_start(day):
    return day.replace(day=1)


def shift_month(day, months):
    month = day.month - 1 + months
    year = day.year + month // 12
    return date(year, month % 12 + 1, 1)


def period_total(rows, date_field, start, end):
    return money(
        sum(
            float(row.get("amount") or 0)
            for row in rows
            if (row_date(row, date_field) or date.min) >= start
            and (row_date(row, date_field) or date.min) < end
        )
    )


def monthly_reports(sales, expenses, today, count=6):
    current = month_start(today)
    reports = []
    for offset in range(count - 1, -1, -1):
        start = shift_month(current, -offset)
        end = shift_month(start, 1)
        sales_total = period_total(sales, "sale_date", start, end)
        expenses_total = period_total(expenses, "expense_date", start, end)
        reports.append({
            "label": start.strftime("%b"),
            "month": start.month,
            "year": start.year,
            "sales": sales_total,
            "expenses": expenses_total,
            "profit": money(sales_total - expenses_total),
        })
    return reports