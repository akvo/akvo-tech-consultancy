from app import db, FormInstance
from sqlalchemy import and_, Integer

# clean startup
FormInstance.query.delete()

f1 = FormInstance(state="{}", meta={"instance": "idh", "user": 1})
f2 = FormInstance(state="{}", meta={"instance": "idh", "user": 2})
f3 = FormInstance(state="{}", meta={"instance": "idh", "user": 2})
f4 = FormInstance(state="{}", meta={"instance": "acme", "user": 2})
f5 = FormInstance(
    state="{}", meta={"partner": "2scale", "tag": ["red", "green", "blue"]}
)
f6 = FormInstance(state="{}", meta={"partner": "2scale", "tag": ["red"]})

db.session.add_all([f1, f2, f3, f4, f5, f6])
db.session.commit()

assert (
    FormInstance.query.filter(FormInstance.meta["instance"].astext == "idh").count()
    == 3
)
print(".", end="")

assert (
    FormInstance.query.filter(
        FormInstance.meta["user"].astext.cast(Integer) == 2
    ).count()
    == 3  # 2 from idh, 1 form acme
)
print(".", end="")

assert (
    FormInstance.query.filter(
        and_(
            FormInstance.meta["instance"].astext == "idh",
            FormInstance.meta["user"].astext.cast(Integer) == 2,
        )
    ).count()
    == 2
)
print(".", end="")

assert (
    FormInstance.query.filter(FormInstance.meta["partner"].astext == "2scale").count()
    == 2
)
print(".", end="")

assert (
    FormInstance.query.filter(FormInstance.meta["partner"].astext == "idh").count() == 0
)
print(".", end="")

assert (
    FormInstance.query.filter(FormInstance.meta["tag"].contains(["green"])).count() == 1
)
print(".", end="")

# teardown
print("")
FormInstance.query.delete()
