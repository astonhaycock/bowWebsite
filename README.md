
**BowShop**

## Database Tables

## Admin login
username = admin
password = admin


### 1. Users Table
| Column Name | Data Type       | Description                  |
|-------------|-----------------|------------------------------|
| id          | bigint unsigned | Unique identifier for user   |
| username    | varchar(255)    | Username of the user         |
| password    | varchar(255)    | Hashed password of the user  |
| email       | varchar(255)    | Email address of the user    |
| created_at  | timestamp       | Account creation timestamp   |

## Schema

```mySQL
CREATE TABLE users (
id BIGINT UNSIGNED PRIMARY KEY,
username VARCHAR(255),
password VARCHAR(255),
email VARCHAR(255),
created_at TIMESTAMP);
```

### 2. Bows Table
| Column Name     | Data Type       | Description                      |
|-----------------|-----------------|----------------------------------|
| bow_id          | bigint unsigned | Unique identifier for bow        |
| bow_name        | varchar(50)     | Name of the bow                  |
| bow_type        | varchar(50)     | Type of the bow (e.g., recurve)  |
| bow_weight      | decimal(5,2)    | Weight of the bow in pounds      |
| bow_length      | decimal(5,2)    | Length of the bow in inches      |
| bow_draw_weight | decimal(5,2)    | Draw weight of the bow in pounds |
| bow_draw_length | decimal(5,2)    | Draw length of the bow in inches |
| bow_price       | decimal(5,2)    | Price of the bow                 |
| bow_image_url   | varchar(500)    | URL of the bow's image           |

## Schema

```mySQL
CREATE TABLE bows (
bow_id BIGINT UNSIGNED PRIMARY KEY,
bow_name VARCHAR(50),
bow_type VARCHAR(50),
bow_weight DECIMAL(5,2),
bow_length DECIMAL(5,2),
bow_draw_weight DECIMAL(5,2),
bow_draw_length DECIMAL(5,2),
bow_price DECIMAL(5,2),
bow_image_url VARCHAR(255));
```

## API Endpoints

### Bow Endpoints
1. `GET /bows`  
   **Description:** Retrieves all bows from the database.

2. `GET /bows/<int:id>`  
   **Description:** Retrieves details of a specific bow by its ID.

3. `POST /bows`  
   **Description:** Inserts a new bow into the database. Requires bow details such as name, type, weight, length, draw weight, draw length, price, and image URL.

4. `DELETE /bows/<int:id>`  
   **Description:** Deletes a specific bow from the database by its ID.

5. `PUT /bows/<int:id>`  
   **Description:** Updates attributes of a specific bow by its ID. Requires updated data for any of the bow attributes.

### Admin Endpoints
1. `POST /admins`  
   **Description:** Checks admin authentication using credentials.

---
