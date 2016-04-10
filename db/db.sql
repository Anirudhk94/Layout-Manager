-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Oct 09, 2015 at 08:08 AM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `room_name` varchar(50) NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `room_order` int(11) NOT NULL,
  `is_primary` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `room_name`, `restaurant_id`, `room_order`, `is_primary`) VALUES
(2, 'new1', 0, 0, 0),
(3, 'new2', 0, 0, 0),
(4, 'new3', 0, 0, 0),
(5, 'new4', 0, 0, 0),
(6, 'new5', 0, 0, 0),
(12, '', 0, 0, 0),
(13, 'test', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `width` decimal(10,0) NOT NULL,
  `height` decimal(10,0) NOT NULL,
  `table_html_id` int(11) NOT NULL,
  `table_type` varchar(20) NOT NULL,
  `hchairs` int(11) NOT NULL,
  `vchairs` int(11) NOT NULL,
  `table_name` varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`id`, `room_id`, `x`, `y`, `width`, `height`, `table_html_id`, `table_type`, `hchairs`, `vchairs`, `table_name`) VALUES
(16, 2, 502, 83, '50', '50', 47, 'rectangle', 0, 0, ''),
(17, 2, 402, 74, '50', '75', 53, 'rectangle', 0, 0, ''),
(22, 3, 121, 97, '50', '50', 47, 'circle', 0, 0, ''),
(23, 3, 178, 72, '50', '50', 53, 'rectangle', 0, 0, ''),
(24, 3, 321, 70, '50', '25', 59, 'rectangle', 0, 0, ''),
(25, 3, 254, 71, '50', '75', 63, 'rectangle', 0, 0, ''),
(26, 4, 447, 226, '50', '50', 47, 'rectangle', 0, 0, ''),
(27, 4, 206, 341, '50', '50', 53, 'rectangle', 0, 0, ''),
(28, 4, 187, 91, '50', '50', 59, 'rectangle', 0, 0, ''),
(29, 4, 296, 221, '50', '50', 65, 'rectangle', 0, 0, ''),
(30, 4, 110, 210, '50', '50', 71, 'rectangle', 0, 0, ''),
(31, 12, 262, 192, '50', '50', 47, 'circle', 0, 0, ''),
(62, 13, 314, 129, '50', '25', 47, 'rectangle', 4, 0, ''),
(63, 13, 423, 233, '50', '50', 64, 'circle', 2, 2, ''),
(64, 13, 467, 138, '50', '50', 71, 'circle', 4, 4, ''),
(65, 13, 228, 144, '50', '50', 97, 'circle', 2, 0, 'Table3'),
(66, 13, 286, 234, '50', '50', 103, 'circle', 0, 2, 'Table2'),
(67, 13, 348, 309, '50', '50', 109, 'rectangle', 4, 2, 'Table1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=68;