-- Updates accounts table to have preferred_hood, joined, and efficiency_score columns
ALTER TABLE accounts
ADD preferred_hood VARCHAR(30),
ADD joined DATE,
ADD efficiency_score VARCHAR(15)
