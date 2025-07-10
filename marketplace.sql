-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-07-2025 a las 06:55:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `marketplace`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_productos`
--

CREATE TABLE `carrito_productos` (
  `id` int(11) NOT NULL,
  `carrito_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id`, `usuario_id`, `fecha`, `total`) VALUES
(9, 1, '2025-07-09 23:53:50', 1920000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra_productos`
--

CREATE TABLE `compra_productos` (
  `id` int(11) NOT NULL,
  `compra_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compra_productos`
--

INSERT INTO `compra_productos` (`id`, `compra_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
(25, 9, 6, 1, 1200000.00),
(26, 9, 13, 1, 450000.00),
(27, 9, 14, 1, 150000.00),
(28, 9, 11, 1, 120000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `titulo`, `precio`, `imagen`, `descripcion`, `usuario_id`) VALUES
(6, 'Acer Aspire i3, 8 GB RAM, SSD 256 GB', 1200000.00, 'https://elnstore.com/cdn/shop/files/acer-aspire-go-14-ag14-31p-non-fingerprint-non-backlit-wallpaper-start-screen-pure-silver-01-1000x1000_nx.kv6aa.001.png?v=1723372200&width=713', 'Ideal para estudios y oficina; disco sólido mejora velocidad.', NULL),
(7, 'Dell Latitude i5, 8 GB RAM, SSD 256 GB', 1400000.00, 'https://elnstore.com/cdn/shop/files/notebook-latitude-14-5450t-ir-gallery-20.png?v=1741875792&width=493', 'Portátil robusto, excelente calidad de construcción; buen para uso prolongado.', NULL),
(9, 'Lenovo ThinkPad T470 i7, 8 GB RAM, SSD 256 GB', 1800000.00, 'https://elnstore.com/cdn/shop/files/ThinkPad_E16_Gen_2_Intel_CT1_03.png?v=1745654494&width=493', ' Muy durable, ideal para movilidad y trabajos exigentes', NULL),
(10, 'Chaqueta de cuero vintage', 80000.00, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQqq_OLFEh9Iy7yQbsr1pscc3Mks0_Uwzt1uqCppEq7UfrmxtOD30urWIP9Ih7v4gBSfkEvZZUYjAsz02CoJ4M5csRQHe36MlbsAfTs6ppSYCswMQpcgwfJWALDAOLPybciHV02gY4HN-0&usqp=CAc', 'Estilo clásico, buen estado, ideal para complementar outfits.', NULL),
(11, 'Zapatos Sneakers', 120000.00, 'https://milanelo.com/cdn/shop/files/153_7862f25a-e1a2-4dd3-b612-3d9f192089c7.jpg?v=1716828167', 'Seminuevos, cómodos y versátiles para uso diario', NULL),
(12, 'Nintendo Switch (usada, con controles)', 500000.00, 'https://http2.mlstatic.com/D_NQ_NP_920511-MCO48507100069_122021-O.webp', 'Consola portátil + Dock; ideal para jugar en casa o fuera.', NULL),
(13, 'PS4 Slim (usada, 1 TB)', 450000.00, 'https://http2.mlstatic.com/D_NQ_NP_978875-MCO85783962082_062025-O.webp', 'Audio/visual, incluye discos; perfecta para casual gaming.', NULL),
(14, 'Catan (ed. básica)', 150000.00, 'https://www.eltablero.com.co/wp-content/uploads/2022/06/catan.jpeg', 'Juego de estrategia, usado pocas veces; ideal para reuniones.', NULL),
(15, 'Carcassonne (v2)', 20000.00, 'https://gryplanszowe.pl/hpeciai/ebcf110dff138452eda04f9f93c3a916/pol_pl_Carcassonne-nowa-II-edycja-polska-2176_5.jpg', ' Juego de mesa clásico, componentes en muy buen estado.', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `contrasena`) VALUES
(1, 'alan', '1234'),
(2, 'lucia', 'abcd'),
(3, 'jose', '4321'),
(4, 'barrera', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `carrito_productos`
--
ALTER TABLE `carrito_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carrito_id` (`carrito_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `compra_productos`
--
ALTER TABLE `compra_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compra_id` (`compra_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito_productos`
--
ALTER TABLE `carrito_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `compra_productos`
--
ALTER TABLE `compra_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `carrito_productos`
--
ALTER TABLE `carrito_productos`
  ADD CONSTRAINT `carrito_productos_ibfk_1` FOREIGN KEY (`carrito_id`) REFERENCES `carritos` (`id`),
  ADD CONSTRAINT `carrito_productos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `compra_productos`
--
ALTER TABLE `compra_productos`
  ADD CONSTRAINT `compra_productos_ibfk_1` FOREIGN KEY (`compra_id`) REFERENCES `compras` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compra_productos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
