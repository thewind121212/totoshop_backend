SELECT
  `shop_data`.`combine_categories`.`id` AS `id`,
  `shop_data`.`combine_categories`.`name` AS `name`,
  `pc`.`id` AS `category_id`,
  `pc`.`name` AS `category_name`,
  `pmt`.`id` AS `gender_id`,
  `pmt`.`name` AS `gender`
FROM
  (
    (
      (
        `shop_data`.`combine_categories`
        LEFT JOIN `shop_data`.`Product_types_categories` ON(
          `shop_data`.`combine_categories`.`product_type_categoriesID` = `shop_data`.`Product_types_categories`.`id`
        )
      )
      JOIN `shop_data`.`Product_main_types` `pmt` ON(
        `shop_data`.`Product_types_categories`.`product_main_typesID` = `pmt`.`id`
      )
    )
    JOIN `shop_data`.`product_categories` `pc` ON(
      `shop_data`.`Product_types_categories`.`product_categoriesID` = `pc`.`id`
    )
  )