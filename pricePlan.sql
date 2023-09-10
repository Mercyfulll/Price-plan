CREATE TABLE price_plan(
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR,
    sms_price DECIMAL (3,2),
    call_price DECIMAL (3,2)
    );

CREATE TABLE  users(
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL ,
    price_plan_id INT REFERENCES price_plan (id)
);

INSERT INTO price_plan (plan_name,sms_price,call_price) VALUES
    ('sms100',0.20,2.35),
    ('call100',0.45,1.75),
    ('text-me',0.17,1.54); 