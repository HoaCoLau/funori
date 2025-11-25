CREATE TABLE `Styles` (
  `style_id` INT PRIMARY KEY AUTO_INCREMENT,
  `style_name` VARCHAR(100) UNIQUE NOT NULL,
  `style_description` TEXT
);

CREATE TABLE `Categories` (
  `category_id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_name` VARCHAR(255) NOT NULL,
  `parent_id` INT,
  `description` TEXT,
  `category_image` VARCHAR(255)
);

CREATE TABLE `Attributes` (
  `attribute_id` INT PRIMARY KEY AUTO_INCREMENT,
  `attribute_name` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Ví dụ: "Màu sắc", "Chất liệu bọc", "Kích thước"'
);

CREATE TABLE `Attribute_Values` (
  `value_id` INT PRIMARY KEY AUTO_INCREMENT,
  `attribute_id` INT NOT NULL,
  `value_name` VARCHAR(255) NOT NULL COMMENT 'Ví dụ: "Da bò Ý", "Trắng kem"',
  `swatch_code` VARCHAR(50) COMMENT 'Mã màu HEX (#FFFFFF) hoặc URL ảnh mẫu vải'
);

CREATE TABLE `Collections` (
  `collection_id` INT PRIMARY KEY AUTO_INCREMENT,
  `collection_name` VARCHAR(255) NOT NULL,
  `style_id` INT,
  `description` TEXT,
  `lifestyle_image` VARCHAR(255) COMMENT 'Ảnh chụp cả bộ sưu tập'
);

CREATE TABLE `Products` (
  `product_id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_name` VARCHAR(255) NOT NULL,
  `base_sku` VARCHAR(100) UNIQUE NOT NULL COMMENT 'SKU cho sản phẩm gốc',
  `description` TEXT,
  `base_price` DECIMAL(12,2) DEFAULT 0 COMMENT 'Giá khởi điểm, có thể bị ghi đè bởi biến thể',
  `is_customizable` BOOLEAN DEFAULT false,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Product_Categories` (
  `product_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `category_id`)
);

CREATE TABLE `Product_Collections` (
  `product_id` INT NOT NULL,
  `collection_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `collection_id`)
);

CREATE TABLE `Product_Variants` (
  `variant_id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `variant_sku` VARCHAR(150) UNIQUE NOT NULL COMMENT 'SKU duy nhất cho từng biến thể',
  `price` DECIMAL(12,2) NOT NULL COMMENT 'Giá cụ thể cho biến thể này',
  `stock_quantity` INT DEFAULT 0,
  `main_image_url` VARCHAR(255) COMMENT 'Ảnh đại diện cho biến thể này'
);

CREATE TABLE `Variant_Attribute_Values` (
  `variant_id` INT NOT NULL,
  `value_id` INT NOT NULL,
  PRIMARY KEY (`variant_id`, `value_id`)
);

CREATE TABLE `Product_Images` (
  `image_id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT NOT NULL COMMENT 'Ảnh này thuộc sản phẩm nào',
  `variant_id` INT COMMENT 'Nếu NULL, là ảnh chung. Nếu có, là ảnh riêng của biến thể',
  `image_url` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255),
  `sort_order` INT DEFAULT 0
);

CREATE TABLE `Product_Specifications` (
  `spec_id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `spec_name` VARCHAR(100) NOT NULL COMMENT 'Ví dụ: "Chiều dài", "Bảo hành"',
  `spec_value` VARCHAR(255) NOT NULL COMMENT 'Ví dụ: "2200mm", "5 năm"'
);

CREATE TABLE `Roles` (
  `role_id` INT PRIMARY KEY AUTO_INCREMENT,
  `role_name` VARCHAR(50) UNIQUE NOT NULL COMMENT 'Ví dụ: "Admin", "Customer", "Manager"'
);

CREATE TABLE `Users` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `role_id` INT NOT NULL DEFAULT 2,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone` VARCHAR(20) UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'KHÔNG lưu mật khẩu gốc, luôn lưu dạng hash (bcrypt)',
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Addresses` (
  `address_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `full_name` VARCHAR(255) COMMENT 'Tên người nhận (có thể khác tên chủ TK)',
  `phone` VARCHAR(20) COMMENT 'SĐT người nhận',
  `address_line1` VARCHAR(255) NOT NULL COMMENT 'Số nhà, tên đường',
  `ward_name` VARCHAR(100) COMMENT 'Tên Phường/Xã',
  `district_name` VARCHAR(100) COMMENT 'Tên Quận/Huyện',
  `city_name` VARCHAR(100) NOT NULL COMMENT 'Tên Tỉnh/Thành phố',
  `is_default` BOOLEAN DEFAULT false
);

CREATE TABLE `Carts` (
  `cart_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT UNIQUE COMMENT 'NULL nếu là giỏ hàng của khách (guest)',
  `session_id` VARCHAR(255) COMMENT 'Dùng để tracking giỏ hàng của khách (guest)',
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Cart_Items` (
  `cart_item_id` INT PRIMARY KEY AUTO_INCREMENT,
  `cart_id` INT NOT NULL,
  `variant_id` INT NOT NULL COMMENT 'Sản phẩm thêm vào giỏ là 1 biến thể cụ thể',
  `quantity` INT NOT NULL DEFAULT 1
);

CREATE TABLE `Wishlists` (
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL COMMENT 'Thường người dùng sẽ thích sản phẩm gốc, không phải biến thể',
  PRIMARY KEY (`user_id`, `product_id`)
);

CREATE TABLE `Reviews` (
  `review_id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` TINYINT NOT NULL COMMENT 'Từ 1 đến 5',
  `title` VARCHAR(255),
  `comment` TEXT,
  `status` VARCHAR(50) DEFAULT 'Pending' COMMENT 'Pending, Approved, Rejected',
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Post_Categories` (
  `post_category_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `parent_id` INT
);

CREATE TABLE `Posts` (
  `post_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT COMMENT 'Tác giả bài viết (FK đến Users.user_id)',
  `post_category_id` INT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `excerpt` TEXT COMMENT 'Mô tả ngắn/tóm tắt',
  `content` LONGTEXT,
  `featured_image` VARCHAR(255),
  `status` ENUM ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  `published_at` TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Contact_Submissions` (
  `submission_id` INT PRIMARY KEY AUTO_INCREMENT,
  `full_name` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` VARCHAR(20),
  `subject` VARCHAR(255),
  `message_content` TEXT NOT NULL,
  `status` ENUM ('new', 'read', 'replied', 'spam') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Payment_Methods` (
  `payment_method_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., cod, vnpay, bank_transfer',
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT true
);

CREATE TABLE `Shipping_Methods` (
  `shipping_method_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., standard, express',
  `base_cost` DECIMAL(12,2) DEFAULT 0,
  `description` TEXT COMMENT 'e.g., "2-3 ngày làm việc"',
  `is_active` BOOLEAN DEFAULT true
);

CREATE TABLE `Coupons` (
  `coupon_id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Mã mà người dùng nhập, ví dụ: "SALE20"',
  `description` TEXT NOT NULL COMMENT 'Mô tả nội bộ, ví dụ: "Giảm 20% cho BST Mùa hè"',
  `discount_type` ENUM ('percentage', 'fixed_amount') NOT NULL,
  `discount_value` DECIMAL(10,2) NOT NULL,
  `max_discount_amount` DECIMAL(12,2),
  `min_purchase_amount` DECIMAL(12,2) DEFAULT 0,
  `scope_type` ENUM ('site_wide', 'by_collection', 'by_category', 'by_product') NOT NULL DEFAULT 'site_wide',
  `start_date` TIMESTAMP NOT NULL,
  `end_date` TIMESTAMP NOT NULL,
  `usage_limit_total` INT,
  `usage_limit_per_user` INT DEFAULT 1,
  `current_usage_count` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT true,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Coupon_Products` (
  `coupon_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`coupon_id`, `product_id`)
);

CREATE TABLE `Coupon_Categories` (
  `coupon_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`coupon_id`, `category_id`)
);

CREATE TABLE `Coupon_Collections` (
  `coupon_id` INT NOT NULL,
  `collection_id` INT NOT NULL,
  PRIMARY KEY (`coupon_id`, `collection_id`)
);

CREATE TABLE `Banners` (
  `banner_id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT,
  `image_url_desktop` VARCHAR(255) NOT NULL,
  `image_url_mobile` VARCHAR(255),
  `target_url` VARCHAR(255) COMMENT 'Link khi click vào banner (ví dụ: /collections/milano)',
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT true
);

CREATE TABLE `Orders` (
  `order_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT COMMENT 'NULL nếu là khách (guest) đặt hàng',
  `order_date` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `status` VARCHAR(50) DEFAULT 'Pending' COMMENT 'Pending, Processing, Shipped, Delivered, Cancelled',
  `shipping_full_name` VARCHAR(255) NOT NULL,
  `shipping_phone` VARCHAR(20) NOT NULL,
  `shipping_address_line1` VARCHAR(255) NOT NULL,
  `shipping_ward` VARCHAR(100),
  `shipping_district` VARCHAR(100),
  `shipping_city` VARCHAR(100) NOT NULL,
  `shipping_method_id` INT,
  `payment_method_id` INT,
  `subtotal_amount` DECIMAL(12,2) NOT NULL COMMENT 'Tổng tiền hàng',
  `shipping_fee` DECIMAL(12,2) DEFAULT 0,
  `discount_amount` DECIMAL(12,2) DEFAULT 0,
  `total_amount` DECIMAL(12,2) NOT NULL COMMENT 'Tổng tiền cuối cùng phải trả',
  `applied_coupon_code` VARCHAR(100) COMMENT 'Mã code đã nhập',
  `coupon_id` INT COMMENT 'FK liên kết đến mã giảm giá',
  `customer_note` TEXT
);

CREATE TABLE `Order_Items` (
  `order_item_id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `variant_id` INT COMMENT 'NULL nếu biến thể đã bị xóa khỏi CSDL',
  `quantity` INT NOT NULL,
  `product_name_at_purchase` VARCHAR(255) NOT NULL,
  `variant_sku_at_purchase` VARCHAR(150) NOT NULL,
  `price_at_purchase` DECIMAL(12,2) NOT NULL COMMENT 'Giá của 1 sản phẩm tại thời điểm mua'
);

CREATE TABLE `Payments` (
  `payment_id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `payment_method_id` INT COMMENT 'FK to payment_methods',
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'Pending' COMMENT 'Pending, Success, Failed',
  `amount` DECIMAL(12,2) NOT NULL COMMENT 'Số tiền thanh toán',
  `transaction_code` VARCHAR(255) COMMENT 'Mã giao dịch từ bên thứ 3 (VNPAY, Momo...)',
  `payment_date` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Coupon_Usage_History` (
  `usage_id` INT PRIMARY KEY AUTO_INCREMENT,
  `coupon_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `order_id` INT NOT NULL,
  `used_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX `cart_variant` ON `Cart_Items` (`cart_id`, `variant_id`);

CREATE INDEX `idx_code` ON `Coupons` (`code`);

CREATE INDEX `idx_dates` ON `Coupons` (`start_date`, `end_date`);

ALTER TABLE `Categories` ADD FOREIGN KEY (`parent_id`) REFERENCES `Categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Attribute_Values` ADD FOREIGN KEY (`attribute_id`) REFERENCES `Attributes` (`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Collections` ADD FOREIGN KEY (`style_id`) REFERENCES `Styles` (`style_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Product_Categories` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Product_Categories` ADD FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Product_Collections` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Product_Collections` ADD FOREIGN KEY (`collection_id`) REFERENCES `Collections` (`collection_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Product_Variants` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Variant_Attribute_Values` ADD FOREIGN KEY (`variant_id`) REFERENCES `Product_Variants` (`variant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Variant_Attribute_Values` ADD FOREIGN KEY (`value_id`) REFERENCES `Attribute_Values` (`value_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Product_Images` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Product_Images` ADD FOREIGN KEY (`variant_id`) REFERENCES `Product_Variants` (`variant_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Product_Specifications` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Users` ADD FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`);

ALTER TABLE `Addresses` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Carts` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Cart_Items` ADD FOREIGN KEY (`cart_id`) REFERENCES `Carts` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Cart_Items` ADD FOREIGN KEY (`variant_id`) REFERENCES `Product_Variants` (`variant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Wishlists` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Wishlists` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Reviews` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Post_Categories` ADD FOREIGN KEY (`parent_id`) REFERENCES `Post_Categories` (`post_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Posts` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Posts` ADD FOREIGN KEY (`post_category_id`) REFERENCES `Post_Categories` (`post_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Coupon_Products` ADD FOREIGN KEY (`coupon_id`) REFERENCES `Coupons` (`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Coupon_Products` ADD FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Coupon_Categories` ADD FOREIGN KEY (`coupon_id`) REFERENCES `Coupons` (`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Coupon_Categories` ADD FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Coupon_Collections` ADD FOREIGN KEY (`coupon_id`) REFERENCES `Coupons` (`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Coupon_Collections` ADD FOREIGN KEY (`collection_id`) REFERENCES `Collections` (`collection_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Orders` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Orders` ADD FOREIGN KEY (`coupon_id`) REFERENCES `Coupons` (`coupon_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Orders` ADD FOREIGN KEY (`shipping_method_id`) REFERENCES `Shipping_Methods` (`shipping_method_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Orders` ADD FOREIGN KEY (`payment_method_id`) REFERENCES `Payment_Methods` (`payment_method_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Order_Items` ADD FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Order_Items` ADD FOREIGN KEY (`variant_id`) REFERENCES `Product_Variants` (`variant_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Payments` ADD FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Payments` ADD FOREIGN KEY (`payment_method_id`) REFERENCES `Payment_Methods` (`payment_method_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Coupon_Usage_History` ADD FOREIGN KEY (`coupon_id`) REFERENCES `Coupons` (`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Coupon_Usage_History` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Coupon_Usage_History` ADD FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
