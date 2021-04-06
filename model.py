"""Models for children database"""

from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()



class Child(db.Model):
    """A list of children."""

    __tablename__ = "children"

    child_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=True)
    ethnicity = db.Column(db.String(100), nullable=True)
    age_missing = db.Column(db.Float, nullable=False)
    # current_age = db.Column(db.Integer, nullable= True)
    
    #Case Number,DLC,Last Name,First Name,Missing Age,City,County,State,Sex,Race / Ethnicity,Date Modified


    def __init__(self, case_id, dlc, lname, fname, age_missing, city, county, state, sex, ethnicity):
        self.fname = fname
        self.lname = lname
        self.ethnicity = ethnicity
        self.age_missing = age_missing
        # self.city = city
        # self.county = county
        # self.state = state
        # self.sex = sex
        # self.ethnicity = ethnicity
        # self.date_modified = date_modified

        # self.current_age = (current_date - dlc) + age_missing
        # TODO calculate the child's current age
    
    #Setting up SQLAlchemy relationship between children and locations
    locations = db.relationship('Location', backref = 'children')


    def __repr__(self):
        """Provide helpful representation when printed."""

        return f"<Child child_id={self.child_id} name={self.fname} {self.lname}>"



class Location(db.Model):
    """A list of case locations."""

    __tablename__ = "locations"

    case_id = db.Column(db.Integer, db.ForeignKey('children.child_id'), autoincrement=True,  primary_key=True)
    state = db.Column(db.String(2), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    county = db.Column(db.String(50), nullable=True)

    # children = backref a list of children
    #Setting up SQLAlchemy relationship between locations and pictures
    # pictures = db.relationship('Picture', backref = 'locations')

    def __init__(self, case_id, dlc, lname, fname, age_missing, city, county, state, sex, ethnicity):
    # def __init__(case_id, city, county, state):
        self.case_id = case_id
        self.state = state
        self.city = city
        self.county = county


    def __repr__(self):
        """Provide helpful representation when printed."""

        return f"<Location case_id={self.case_id} state={self.state} city={self.city}>"



# class Picture(db.Model):
#     """A list of picture urls"""

#     __tablename__ = "pictures"

#     picture_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
#     pic_state = db.Column(db.String(2), db.ForeignKey('locations.state'), nullable=False)
#     picture_path = db.Column(db.String(200), nullable=False)

#     # location = backref a list of case locations.

#     def __repr__(self):
#         """Provide helpful representation when printed."""

#         return f"<Picture pic_id={self.pic_id} pic_state={self.pic_state}>"





def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///children'
    #postgresql setting database as name "children"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
    print("Connected to DB.")




