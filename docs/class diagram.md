Table Manager {
  id_manager integer [pk, increment, not null]
  full_name varchar [not null]
  email varchar [not null, unique]
  password_hash varchar [not null]
  created_at timestamp
}

Table Menu {
  id_menu integer [pk, increment, not null]
  id_manager integer [not null]
  name varchar [not null]
  created_at timestamp
  updated_at timestamp
}

Table Menu_items {
  id_menu_item integer [pk, increment, not null]
  id_menu integer [not null]
  name varchar [not null]
  description text
  price decimal [not null]
  image_url varchar
  available boolean
  created_at timestamp
  updated_at timestamp
}

Table Waiter {
  id_waiter integer [pk, increment, not null]
  id_manager integer [not null]
  first_name varchar [not null]
  email varchar [not null, unique]
  password_hash varchar [not null]
  created_at timestamp
}

Table RestaurantTable {
  id_table integer [pk, increment, not null]
  id_manager integer [not null]
  table_number integer [not null]
  capacity integer
  status varchar
  created_at timestamp
}

Table Customer {
  id_customer integer [pk, increment, not null]
  name varchar
  phone varchar
  email varchar
  created_at timestamp
}

Table Visit {
  id_visit integer [pk, increment, not null]
  id_customer integer
  id_table integer [not null]
  started_at timestamp
  ended_at timestamp
  status varchar
}

Table Orders {
  id_order integer [pk, increment, not null]
  id_visit integer [not null]
  accepted_by_waiter_id integer
  status varchar
  created_at timestamp
  updated_at timestamp
}

Table Order_items {
  id_order_item integer [pk, increment, not null]
  id_order integer [not null]
  id_menu_item integer [not null]
  quantity integer [not null]
  unit_price decimal [not null]
  subtotal decimal
  created_at timestamp
}

Table Review {
  id_review integer [pk, increment, not null]
  id_visit integer [not null]
  rating integer [not null]
  comment text
  created_at timestamp
}

Ref: Menu.id_manager > Manager.id_manager
Ref: Menu_items.id_menu > Menu.id_menu
Ref: Waiter.id_manager > Manager.id_manager
Ref: RestaurantTable.id_manager > Manager.id_manager
Ref: Visit.id_customer > Customer.id_customer
Ref: Visit.id_table > RestaurantTable.id_table
Ref: Orders.id_visit > Visit.id_visit
Ref: Orders.accepted_by_waiter_id > Waiter.id_waiter
Ref: Order_items.id_order > Orders.id_order
Ref: Order_items.id_menu_item > Menu_items.id_menu_item
Ref: Review.id_visit > Visit.id_visit
