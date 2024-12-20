create schema miloradowicz_hw80 collate utf8mb3_general_ci;

use miloradowicz_hw80;

create table if not exists categories
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description varchar(255) null
);

create table if not exists locations
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description varchar(255) null
);

create table if not exists resources
(
    id          int auto_increment
        primary key,
    category_id int          not null,
    location_id int          not null,
    name        varchar(255) not null,
    description varchar(255) null,
    photo_url   varchar(255) null,
    created_at  datetime     not null,
    constraint resources_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint resources_locations_id_fk
        foreign key (location_id) references locations (id)
);

INSERT INTO miloradowicz_hw80.categories (id, name, description) VALUES (1, 'Supplies', null);
INSERT INTO miloradowicz_hw80.categories (id, name, description) VALUES (2, 'Electronics', null);
INSERT INTO miloradowicz_hw80.categories (id, name, description) VALUES (3, 'Furniture', null);
INSERT INTO miloradowicz_hw80.categories (id, name, description) VALUES (4, 'Appliances', null);

INSERT INTO miloradowicz_hw80.locations (id, name, description) VALUES (1, 'Office', null);
INSERT INTO miloradowicz_hw80.locations (id, name, description) VALUES (2, 'Reception', null);
INSERT INTO miloradowicz_hw80.locations (id, name, description) VALUES (3, 'Storage Room', null);
INSERT INTO miloradowicz_hw80.locations (id, name, description) VALUES (4, 'Kitchen', 'The heart of the company');

INSERT INTO miloradowicz_hw80.resources (id, category_id, location_id, name, description, photo_url, created_at) VALUES (1, 1, 1, 'Paper', null, null, '2024-12-21 01:56:29');
INSERT INTO miloradowicz_hw80.resources (id, category_id, location_id, name, description, photo_url, created_at) VALUES (2, 2, 1, 'Computer', null, null, '2024-12-21 01:56:46');
INSERT INTO miloradowicz_hw80.resources (id, category_id, location_id, name, description, photo_url, created_at) VALUES (3, 2, 1, 'Tablet', null, null, '2024-12-21 02:27:46');
INSERT INTO miloradowicz_hw80.resources (id, category_id, location_id, name, description, photo_url, created_at) VALUES (4, 2, 2, 'Phone', null, null, '2024-12-21 04:35:56');
INSERT INTO miloradowicz_hw80.resources (id, category_id, location_id, name, description, photo_url, created_at) VALUES (5, 1, 3, 'Pen', null, null, '2024-12-21 04:37:01');
INSERT INTO miloradowicz_hw80.resources (id, category_id, location_id, name, description, photo_url, created_at) VALUES (6, 1, 3, 'Pencil', null, null, '2024-12-21 04:41:16');
INSERT INTO miloradowicz_hw80.resources (id, category_id, location_id, name, description, photo_url, created_at) VALUES (7, 4, 4, 'Kettle', null, null, '2024-12-21 04:44:12');