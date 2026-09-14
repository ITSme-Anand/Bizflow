from flask import Flask, render_template, request, redirect, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date, datetime


app = Flask(__name__)


# ============================================================
# FLASK SECRET KEY
# ============================================================

app.secret_key = "localhub_secret_key_2026"


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="srisha@2008",
        database="localhub"
    )


# ============================================================
# HOME
# ============================================================

@app.route("/")
def index():
    return render_template("index.html")


# ============================================================
# LOGIN
# ============================================================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email = %s",
            (email,)
        )

        user = cursor.fetchone()

        cursor.close()
        db.close()


        if user and check_password_hash(
            user["password"],
            password
        ):

            session["user_id"] = user["id"]
            session["business_name"] = user["business_name"]
            session["email"] = user["email"]

            return redirect("/dashboard")


        return render_template(
            "login.html",
            error="Invalid email or password."
        )


    return render_template("login.html")


# ============================================================
# SIGNUP
# ============================================================

@app.route("/signup", methods=["GET", "POST"])
def signup():

    if request.method == "POST":

        business_name = request.form["business_name"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]


        if password != confirm_password:

            return render_template(
                "signup.html",
                error="Passwords do not match."
            )


        hashed_password = generate_password_hash(password)


        db = get_db_connection()
        cursor = db.cursor()


        try:

            cursor.execute(
                """
                INSERT INTO users
                (business_name, email, password)
                VALUES (%s, %s, %s)
                """,
                (
                    business_name,
                    email,
                    hashed_password
                )
            )

            db.commit()


        except mysql.connector.IntegrityError:

            cursor.close()
            db.close()

            return render_template(
                "signup.html",
                error="An account with this email already exists."
            )


        cursor.close()
        db.close()

        return redirect("/login")


    return render_template("signup.html")


# ============================================================
# DASHBOARD
# ============================================================

@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        return redirect("/login")


    user_id = session["user_id"]

    today = date.today()

    current_hour = datetime.now().hour


    if 5 <= current_hour < 12:
        greeting = "Good morning"

    elif 12 <= current_hour < 17:
        greeting = "Good afternoon"

    else:
        greeting = "Good evening"


    business_name = session["business_name"]


    db = get_db_connection()
    cursor = db.cursor(dictionary=True)


    # --------------------------------------------------------
    # TODAY'S SALES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            product_name,
            quantity,
            unit,
            amount,
            transaction_date,
            sale_date
        FROM sales
        WHERE user_id = %s
        AND COALESCE(transaction_date, DATE(sale_date)) = %s
        ORDER BY id DESC
        """,
        (
            user_id,
            today
        )
    )

    today_sales = cursor.fetchall()


    # --------------------------------------------------------
    # TODAY'S EXPENSES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            expense_name,
            amount,
            transaction_date,
            expense_date
        FROM expenses
        WHERE user_id = %s
        AND COALESCE(transaction_date, DATE(expense_date)) = %s
        ORDER BY id DESC
        """,
        (
            user_id,
            today
        )
    )

    today_expenses = cursor.fetchall()


    # --------------------------------------------------------
    # CURRENT INVENTORY
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            product_name,
            quantity,
            unit,
            price,
            created_at
        FROM inventory
        WHERE user_id = %s
        ORDER BY id DESC
        """,
        (user_id,)
    )

    inventory = cursor.fetchall()


    # --------------------------------------------------------
    # TOTALS
    # --------------------------------------------------------

    total_sales = sum(
        float(sale["amount"])
        for sale in today_sales
    )


    total_expenses = sum(
        float(expense["amount"])
        for expense in today_expenses
    )


    profit = total_sales - total_expenses

    inventory_count = len(inventory)


    cursor.close()
    db.close()


    return render_template(
        "dashboard.html",
        today=today,
        greeting=greeting,
        business_name=business_name,
        today_sales=today_sales,
        today_expenses=today_expenses,
        inventory=inventory,
        total_sales=total_sales,
        total_expenses=total_expenses,
        profit=profit,
        inventory_count=inventory_count
    )


# ============================================================
# SALES
# ============================================================

@app.route("/sales", methods=["GET", "POST"])
def sales():

    if "user_id" not in session:
        return redirect("/login")


    user_id = session["user_id"]


    db = get_db_connection()
    cursor = db.cursor(dictionary=True)


    # --------------------------------------------------------
    # ADD SALE
    # --------------------------------------------------------

    if request.method == "POST":

        product_name = request.form["product_name"]
        quantity = request.form["quantity"]
        unit = request.form["unit"]
        amount = request.form["amount"]


        # Automatically record today's date
        transaction_date = date.today()


        cursor.execute(
            """
            INSERT INTO sales
            (
                user_id,
                product_name,
                quantity,
                unit,
                amount,
                transaction_date
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                user_id,
                product_name,
                quantity,
                unit,
                amount,
                transaction_date
            )
        )


        # ----------------------------------------------------
        # REDUCE INVENTORY
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                quantity
            FROM inventory
            WHERE user_id = %s
            AND product_name = %s
            LIMIT 1
            """,
            (
                user_id,
                product_name
            )
        )


        inventory_item = cursor.fetchone()


        if inventory_item:

            new_quantity = (
                float(inventory_item["quantity"])
                - float(quantity)
            )


            if new_quantity < 0:
                new_quantity = 0


            cursor.execute(
                """
                UPDATE inventory
                SET quantity = %s
                WHERE id = %s
                AND user_id = %s
                """,
                (
                    new_quantity,
                    inventory_item["id"],
                    user_id
                )
            )


        db.commit()


    # --------------------------------------------------------
    # GET SALES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            product_name,
            quantity,
            unit,
            amount,
            transaction_date,
            sale_date
        FROM sales
        WHERE user_id = %s
        ORDER BY
            COALESCE(transaction_date, DATE(sale_date)) DESC,
            id DESC
        """,
        (user_id,)
    )


    sales_data = cursor.fetchall()


    cursor.close()
    db.close()


    return render_template(
        "sales.html",
        sales=sales_data,
        today=date.today()
    )


# ============================================================
# EXPENSES
# ============================================================

@app.route("/expenses", methods=["GET", "POST"])
def expenses():

    if "user_id" not in session:
        return redirect("/login")


    user_id = session["user_id"]


    db = get_db_connection()
    cursor = db.cursor(dictionary=True)


    # --------------------------------------------------------
    # ADD EXPENSE
    # --------------------------------------------------------

    if request.method == "POST":

        expense_name = request.form["expense_name"]
        amount = request.form["amount"]

        # Automatically record today's date
        transaction_date = date.today()


        cursor.execute(
            """
            INSERT INTO expenses
            (
                user_id,
                expense_name,
                amount,
                transaction_date
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                user_id,
                expense_name,
                amount,
                transaction_date
            )
        )


        db.commit()


    # --------------------------------------------------------
    # GET EXPENSES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            expense_name,
            amount,
            transaction_date,
            expense_date
        FROM expenses
        WHERE user_id = %s
        ORDER BY
            COALESCE(transaction_date, DATE(expense_date)) DESC,
            id DESC
        """,
        (user_id,)
    )


    expenses_data = cursor.fetchall()


    cursor.close()
    db.close()


    return render_template(
        "expenses.html",
        expenses=expenses_data,
        today=date.today()
    )


# ============================================================
# INVENTORY
# ============================================================

@app.route("/inventory", methods=["GET", "POST"])
def inventory():

    if "user_id" not in session:
        return redirect("/login")


    user_id = session["user_id"]


    db = get_db_connection()
    cursor = db.cursor(dictionary=True)


    # --------------------------------------------------------
    # ADD PRODUCT
    # --------------------------------------------------------

    if request.method == "POST":

        product_name = request.form["product_name"]
        quantity = request.form["quantity"]
        unit = request.form["unit"]
        price = request.form["price"]


        cursor.execute(
            """
            INSERT INTO inventory
            (
                user_id,
                product_name,
                quantity,
                unit,
                price
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                user_id,
                product_name,
                quantity,
                unit,
                price
            )
        )


        db.commit()


    # --------------------------------------------------------
    # GET INVENTORY
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            id,
            product_name,
            quantity,
            unit,
            price,
            created_at
        FROM inventory
        WHERE user_id = %s
        ORDER BY id DESC
        """,
        (user_id,)
    )


    inventory_data = cursor.fetchall()


    cursor.close()
    db.close()


    return render_template(
        "inventory.html",
        inventory=inventory_data
    )


# ============================================================
# UPDATE INVENTORY
# ============================================================

@app.route("/update_inventory/<int:item_id>/<action>")
def update_inventory(item_id, action):

    if "user_id" not in session:
        return redirect("/login")


    user_id = session["user_id"]


    db = get_db_connection()
    cursor = db.cursor()


    # --------------------------------------------------------
    # INCREASE
    # --------------------------------------------------------

    if action == "increase":

        cursor.execute(
            """
            UPDATE inventory
            SET quantity = quantity + 1
            WHERE id = %s
            AND user_id = %s
            """,
            (
                item_id,
                user_id
            )
        )


    # --------------------------------------------------------
    # DECREASE
    # --------------------------------------------------------

    elif action == "decrease":

        cursor.execute(
            """
            UPDATE inventory
            SET quantity =
                CASE
                    WHEN quantity > 0
                    THEN quantity - 1
                    ELSE 0
                END
            WHERE id = %s
            AND user_id = %s
            """,
            (
                item_id,
                user_id
            )
        )


    db.commit()


    cursor.close()
    db.close()


    return redirect("/inventory")


# ============================================================
# ANALYSIS
# ============================================================

@app.route("/analysis")
def analysis():

    if "user_id" not in session:
        return redirect("/login")


    user_id = session["user_id"]


    today = date.today()

    current_year = today.year
    current_month = today.month


    db = get_db_connection()
    cursor = db.cursor(dictionary=True)


    # --------------------------------------------------------
    # CURRENT MONTH SALES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM sales
        WHERE user_id = %s
        AND YEAR(
            COALESCE(transaction_date, DATE(sale_date))
        ) = %s
        AND MONTH(
            COALESCE(transaction_date, DATE(sale_date))
        ) = %s
        """,
        (
            user_id,
            current_year,
            current_month
        )
    )


    current_month_sales = float(
        cursor.fetchone()["total"]
    )


    # --------------------------------------------------------
    # CURRENT MONTH EXPENSES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE user_id = %s
        AND YEAR(
            COALESCE(transaction_date, DATE(expense_date))
        ) = %s
        AND MONTH(
            COALESCE(transaction_date, DATE(expense_date))
        ) = %s
        """,
        (
            user_id,
            current_year,
            current_month
        )
    )


    current_month_expenses = float(
        cursor.fetchone()["total"]
    )


    # --------------------------------------------------------
    # CURRENT MONTH PROFIT
    # --------------------------------------------------------

    current_month_profit = (
        current_month_sales
        - current_month_expenses
    )


    # --------------------------------------------------------
    # MONTHLY REPORT
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            YEAR(transaction_day) AS year,
            MONTH(transaction_day) AS month,
            SUM(sales_total) AS sales_total,
            SUM(expenses_total) AS expenses_total

        FROM
        (

            SELECT
                COALESCE(
                    transaction_date,
                    DATE(sale_date)
                ) AS transaction_day,

                amount AS sales_total,

                0 AS expenses_total

            FROM sales

            WHERE user_id = %s


            UNION ALL


            SELECT
                COALESCE(
                    transaction_date,
                    DATE(expense_date)
                ) AS transaction_day,

                0 AS sales_total,

                amount AS expenses_total

            FROM expenses

            WHERE user_id = %s

        ) AS combined_data


        GROUP BY
            YEAR(transaction_day),
            MONTH(transaction_day)


        ORDER BY
            year DESC,
            month DESC
        """,
        (
            user_id,
            user_id
        )
    )


    monthly_reports = cursor.fetchall()


    cursor.close()
    db.close()


    return render_template(
        "analysis.html",
        current_year=current_year,
        current_month=current_month,
        current_month_sales=current_month_sales,
        current_month_expenses=current_month_expenses,
        current_month_profit=current_month_profit,
        monthly_reports=monthly_reports
    )


# ============================================================
# MONTHLY ANALYSIS DETAIL
# ============================================================

@app.route("/analysis/<int:year>/<int:month>")
def analysis_detail(year, month):

    if "user_id" not in session:
        return redirect("/login")


    user_id = session["user_id"]


    db = get_db_connection()
    cursor = db.cursor(dictionary=True)


    # --------------------------------------------------------
    # MONTH SALES TOTAL
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM sales
        WHERE user_id = %s
        AND YEAR(
            COALESCE(transaction_date, DATE(sale_date))
        ) = %s
        AND MONTH(
            COALESCE(transaction_date, DATE(sale_date))
        ) = %s
        """,
        (
            user_id,
            year,
            month
        )
    )


    total_sales = float(
        cursor.fetchone()["total"]
    )


    # --------------------------------------------------------
    # MONTH EXPENSE TOTAL
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE user_id = %s
        AND YEAR(
            COALESCE(transaction_date, DATE(expense_date))
        ) = %s
        AND MONTH(
            COALESCE(transaction_date, DATE(expense_date))
        ) = %s
        """,
        (
            user_id,
            year,
            month
        )
    )


    total_expenses = float(
        cursor.fetchone()["total"]
    )


    profit = total_sales - total_expenses


    # --------------------------------------------------------
    # MONTH SALES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            product_name,
            quantity,
            unit,
            amount,
            transaction_date

        FROM sales

        WHERE user_id = %s

        AND YEAR(
            COALESCE(transaction_date, DATE(sale_date))
        ) = %s

        AND MONTH(
            COALESCE(transaction_date, DATE(sale_date))
        ) = %s

        ORDER BY
            COALESCE(transaction_date, DATE(sale_date)) DESC,
            id DESC
        """,
        (
            user_id,
            year,
            month
        )
    )


    monthly_sales = cursor.fetchall()


    # --------------------------------------------------------
    # MONTH EXPENSES
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            expense_name,
            amount,
            transaction_date

        FROM expenses

        WHERE user_id = %s

        AND YEAR(
            COALESCE(transaction_date, DATE(expense_date))
        ) = %s

        AND MONTH(
            COALESCE(transaction_date, DATE(expense_date))
        ) = %s

        ORDER BY
            COALESCE(transaction_date, DATE(expense_date)) DESC,
            id DESC
        """,
        (
            user_id,
            year,
            month
        )
    )


    monthly_expenses = cursor.fetchall()


    cursor.close()
    db.close()


    month_name = date(
        year,
        month,
        1
    ).strftime("%B")


    return render_template(
        "analysis_detail.html",
        year=year,
        month=month,
        month_name=month_name,
        total_sales=total_sales,
        total_expenses=total_expenses,
        profit=profit,
        monthly_sales=monthly_sales,
        monthly_expenses=monthly_expenses
    )


# ============================================================
# PROFILE
# ============================================================

@app.route("/profile")
def profile():

    if "user_id" not in session:
        return redirect("/login")


    business_name = session["business_name"]
    email = session["email"]


    return render_template(
        "profile.html",
        business_name=business_name,
        email=email
    )


# ============================================================
# LOGOUT
# ============================================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/login")


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )